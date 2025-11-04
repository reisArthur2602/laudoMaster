import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";

export const listOrgPatients = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get("/org/:slug/patients", {
      schema: {
        tags: ["Patients"],
        summary: "Listar pacientes da organização",
        security: [{ bearerAuth: [] }],
        params: z.object({ slug: z.string() }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              cpf: z.string(),
              createdAt: z.date(),
            })
          ),
        },
      },
      handler: async (request, reply) => {
        const { slug } = request.params;

        const patients = await prisma.patient.findMany({
          where: { organization: { slug } },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            cpf: true,
            createdAt: true,
          },
        });

        return reply.status(200).send(patients);
      },
    });
};
