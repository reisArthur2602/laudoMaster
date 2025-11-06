import type { FastifyInstance } from "fastify";

import z from "zod";

import { Role } from "@prisma/client";
import { authPlugin } from "../../plugins/auth.js";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../database/prisma/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const removeMember = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)

    .delete("/org/:slug/members/:memberId", {
      schema: {
        params: z.object({
          slug: z.string(),
          memberId: z.string(),
        }),
        tags: ["Member"],
        summary: "Remover membro da organização",
        security: [{ bearerAuth: [] }],
        response: { 204: z.null() },
      },
      handler: async (request, reply) => {
        const { slug, memberId } = request.params;

        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.ADMIN
        );

        const member = await prisma.member.findUnique({
          where: { id: memberId },
          select: { organizationId: true },
        });

        if (!member || member.organizationId !== organizationId) {
          throw new BadRequestError("Membro não pertence a esta organização.");
        }

        await prisma.member.delete({ where: { id: memberId } });

        return reply.status(204).send(null);
      },
    });
};
