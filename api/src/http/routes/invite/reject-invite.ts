import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";
import { authPlugin } from "../../plugins/auth.js";

export const rejectInvite = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post("/invites/:inviteId/reject", {
      schema: {
        tags: ["Invites"],
        summary: "Rejeitar convite",
        params: z.object({
          inviteId: z.string(),
        }),
        response: { 204: z.null() },
      },
      handler: async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { inviteId } = request.params;

        const invite = await prisma.invite.findUnique({
          where: { id: inviteId },
        });
        if (!invite) throw new BadRequestError("Convite não encontrado.");

        await prisma.invite.delete({ where: { id: inviteId } });

        return reply.status(204).send(null);
      },
    });
};
