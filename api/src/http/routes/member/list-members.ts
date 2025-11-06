import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z, { string } from "zod";

import { Role } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";

import { authPlugin } from "../../plugins/auth.js";

export const listMembers = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)

    .get("/org/:slug/members", {
      schema: {
        tags: ["Member"],
        summary: "Listar membros da organização",
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              user: z.object({
                id: string(),
                name: string(),
                email: string(),
              }),
              role: z.nativeEnum(Role),
              createdAt: z.date(),
            })
          ),
        },
      },
      handler: async (request, reply) => {
        const { slug } = request.params;

        const { organizationId } = await request.requireOrgRole(slug, [
          Role.ADMIN,
        ]);

        const members = await prisma.member.findMany({
          where: { organizationId },
          select: {
            id: true,
            role: true,
            createdAt: true,
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        });

        return reply.status(200).send(members);
      },
    });
};
