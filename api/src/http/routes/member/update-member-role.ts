import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authPlugin } from "../../plugins/auth.js";

import { Role } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const updateMemberRole = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)

    .patch("/org/:slug/members/:memberId/role", {
      schema: {
        tags: ["Member"],
        summary: "Atualizar a função de um membro",
        security: [{ bearerAuth: [] }],
        body: z.object({
          role: z.nativeEnum(Role),
        }),
        response: {
          200: z.object({
            id: z.string(),
            role: z.nativeEnum(Role),
            updatedAt: z.date(),
          }),
        },
      },
      handler: async (request, reply) => {
        const { slug, memberId } = request.params as {
          slug: string;
          memberId: string;
        };
        const { role } = request.body;

        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.SUPER_ADMIN
        );

        const member = await prisma.member.findUnique({
          where: { id: memberId },
        });
        if (!member || member.organizationId !== organizationId)
          throw new BadRequestError("Membro não encontrado nesta organização.");

        const updated = await prisma.member.update({
          where: { id: memberId },
          data: { role },
          select: { id: true, role: true, createdAt: true },
        });

        return reply.send({ ...updated, updatedAt: new Date() });
      },
    });
};
