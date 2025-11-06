import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { authPlugin } from "../../plugins/auth.js";

import { Role } from "@prisma/client";
import { BadRequestError } from "../_errors/bad-request-error.js";
import { prisma } from "../../../database/prisma/prisma.js";

export const createInvite = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)

    .post("/org/:slug/invites", {
      schema: {
        tags: ["Invites"],
        summary: "Criar convite para novo membro",
        security: [{ bearerAuth: [] }],
        body: z.object({
          email: z.string().email(),
          role: z.nativeEnum(Role),
        }),
        params: z.object({
          slug: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
      handler: async (request, reply) => {
        const { slug } = request.params;
        const { email, role } = request.body;
        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.ADMIN
        );

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new BadRequestError(
            "Usuário não encontrado. Ele precisa se cadastrar antes de ser convidado."
          );
        }

        const alreadyMember = await prisma.member.findFirst({
          where: { userId: user.id, organizationId },
        });
        if (alreadyMember) {
          throw new BadRequestError("O usuário já é membro desta organização.");
        }

        const existingInvite = await prisma.invite.findFirst({
          where: {
            email,
            organizationId,
            expireAt: { gt: new Date() },
          },
        });
        if (existingInvite) {
          throw new BadRequestError(
            "Já existe um convite ativo para este usuário."
          );
        }

        const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await prisma.invite.create({
          data: { email, role, organizationId, expireAt },
          select: { id: true, email: true, role: true, expireAt: true },
        });

        return reply.status(201).send(null);
      },
    });
};
