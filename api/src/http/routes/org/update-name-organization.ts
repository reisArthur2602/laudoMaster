import type { FastifyInstance } from "fastify";

import z from "zod";
import slugify from "slugify";

import { authPlugin } from "../../plugins/auth.js";

import { Role } from "@prisma/client";
import { BadRequestError } from "../_errors/bad-request-error.js";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../../database/prisma/prisma.js";

export const updateOrganization = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .patch("/org/:slug", {
      schema: {
        tags: ["Organization"],
        summary: "Atualizar dados da organização",
        security: [{ bearerAuth: [] }],
        params: z.object({ slug: z.string() }),
        body: z.object({
          name: z.string().optional(),
        }),
        response: {
          204: z.null(),
        },
      },
      handler: async (request, reply) => {
        const { slug } = request.params;
        const { name } = request.body;

        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.SUPER_ADMIN
        );

        if (!name) throw new BadRequestError("Nada para atualizar.");
        const newSlug = slugify.default(name, { lower: true, strict: true });

        await prisma.organization.update({
          where: { id: organizationId },
          data: { name, slug: newSlug },
        });

        return reply.status(204).send(null);
      },
    });
};
