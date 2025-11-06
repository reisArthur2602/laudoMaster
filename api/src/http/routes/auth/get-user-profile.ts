import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { authPlugin } from "../../plugins/auth.js";
import { prisma } from "../../../database/prisma/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const getUserProfile = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/auth/profile",
      {
        schema: {
          tags: ["Auth"],
          summary: "Obter perfil do usuário autenticado",
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        if (!user) throw new BadRequestError("Token inválido ou expirado.");
        return reply.send(user);
      }
    );
};
