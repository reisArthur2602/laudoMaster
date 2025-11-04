import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const overviewOrganization = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get("/org/:slug/overview", {
      schema: {
        tags: ["Organization"],
        summary: "Resumo geral da organização (overview)",
        security: [{ bearerAuth: [] }],
        params: z.object({ slug: z.string() }),
        response: {
          200: z.object({
            stats: z.object({
              totalPatients: z.number(),
              totalStudies: z.number(),
              pendingStudies: z.number(),
              deliveredStudies: z.number(),

            }),
            studiesByModality: z.array(
              z.object({
                modality: z.string().nullable(),
                count: z.number(),
              })
            ),
            studiesByStatus: z.array(
              z.object({
                status: z.string(),
                count: z.number(),
              })
            ),
            studiesPerDay: z.array(
              z.object({
                date: z.string(),
                count: z.number(),
              })
            ),
          }),
        },
      },
      handler: async (request, reply) => {
        const { slug } = request.params;
        const { organizationId } = await request.getOrgMembershipBySlug(slug);

        const [totalPatients, totalStudies, pendingStudies, deliveredStudies] =
          await Promise.all([
            prisma.patient.count({ where: { organizationId } }),
            prisma.study.count({ where: { organizationId } }),
            prisma.study.count({
              where: { organizationId, status: "PENDING" },
            }),
            prisma.study.count({
              where: { organizationId, status: "DELIVERED" },
            }),
          ]);


        const studiesByModality = await prisma.study.groupBy({
          by: ["modality"],
          where: { organizationId },
          _count: true,
        });

        const studiesByStatus = await prisma.study.groupBy({
          by: ["status"],
          where: { organizationId },
          _count: true,
        });

        const studiesPerDay = await prisma.$queryRawUnsafe<
          { date: string; count: number }[]
        >(`
          SELECT
            TO_CHAR("createdAt", 'YYYY-MM-DD') AS date,
            COUNT(*)::int AS count
          FROM "Study"
          WHERE "organizationId" = '${organizationId}'
            AND "createdAt" >= NOW() - INTERVAL '7 days'
          GROUP BY date
          ORDER BY date ASC;
        `);

const data = {
  stats: {
    totalPatients,
    totalStudies,
    pendingStudies,
    deliveredStudies,

  },
  studiesByModality: studiesByModality.map((s) => ({
    modality: s.modality,
    count: s._count,
  })),
  studiesByStatus: studiesByStatus.map((s) => ({
    status: s.status,
    count: s._count,
  })),
  studiesPerDay,
}

        return reply.status(200).send(data);
      },
    });
};
