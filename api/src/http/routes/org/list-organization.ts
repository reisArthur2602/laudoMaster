import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { authPlugin } from "../../plugins/auth.js";
import { prisma } from "../../../database/prisma/prisma.js";

export const listOrganizations = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get("/org", {
      schema: {
        tags: ["Organization"],
        summary: "Listar todas as organizações do usuário autenticado",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),
              role: z.string(),
              createdAt: z.date(),
            })
          ),
        },
      },
      handler: async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const memberships = await prisma.member.findMany({
          where: { userId },
          include: {
            organization: {
              select: { id: true, name: true, slug: true, createdAt: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        const result = memberships.map((m) => ({
          id: m.organization.id,
          name: m.organization.name,
          slug: m.organization.slug,
          role: m.role,
          createdAt: m.organization.createdAt,
        }));

        return reply.status(200).send(result);
      },
    });
};
