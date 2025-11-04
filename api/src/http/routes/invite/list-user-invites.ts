import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { authPlugin } from "../../plugins/auth.js";
import { prisma } from "../../../database/prisma/prisma.js";

export const listUserInvites = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get("/invites/me", {
      schema: {
        tags: ["Invites"],
        summary: "Listar convites recebidos do usuário autenticado",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              organization: z.object({
                id: z.string(),
                name: z.string(),
              }),
              role: z.string(),
              expireAt: z.date(),
            })
          ),
        },
      },
      handler: async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });

        if (!user) return [];

        const invites = await prisma.invite.findMany({
          where: { email: user.email },
          select: {
            id: true,
            role: true,
            expireAt: true,
            organization: { select: { id: true, name: true } },
          },
        });

        return reply.status(200).send(invites);
      },
    });
};
