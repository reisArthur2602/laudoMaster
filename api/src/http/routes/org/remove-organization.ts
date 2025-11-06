import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { authPlugin } from "../../plugins/auth.js";

import { Role } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";

export const removeOrganization = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .delete("/org/:slug", {
      schema: {
        tags: ["Organization"],
        summary: "Deletar uma organização (somente Super Admin)",
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
      handler: async (request, reply) => {
        const { slug } = request.params;

        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.ADMIN
        );

        await prisma.organization.delete({
          where: { id: organizationId },
        });

        return reply.status(204).send(null);
      },
    });
};
