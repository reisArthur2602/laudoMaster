import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";
import { authPlugin } from "../../plugins/auth.js";

export const acceptInvite = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post("/invites/:inviteId/accept", {
      schema: {
        tags: ["Invites"],
        summary: "Aceitar convite e ingressar na organização",
        params: z.object({
          inviteId: z.string(),
        }),

        response: {
          204: z.null(),
        },
      },

      handler: async (request, reply) => {
        const { inviteId } = request.params;
        const userId = await request.getCurrentUserId();

        const invite = await prisma.invite.findUnique({
          where: { id: inviteId },
        });

        if (!invite || invite.expireAt < new Date()) {
          await prisma.invite.delete({ where: { id: inviteId } });
          throw new BadRequestError("Convite inválido ou expirado.");
        }

        await prisma.member.create({
          data: {
            userId,
            organizationId: invite.organizationId,
            role: invite.role,
          },
        });

        await prisma.invite.delete({ where: { id: inviteId } });

        return reply.status(204).send(null);
      },
    });
};
