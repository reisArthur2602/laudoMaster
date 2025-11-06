import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import slugify from "slugify";

import { authPlugin } from "../../plugins/auth.js";
import { Role } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const createOrganization = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post("/org", {
      schema: {
        tags: ["Organization"],
        summary: "Criar nova organização",
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string().min(3),
        }),
        response: {
          201: z.null(),
        },
      },
      handler: async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { name } = request.body;

        const slug = slugify.default(name, { lower: true, strict: true });

        const existing = await prisma.organization.findUnique({
          where: { slug },
        });

        if (existing)
          throw new BadRequestError("Já existe uma organização com este nome.");

        await prisma.organization.create({
          data: {
            name,
            slug,
            members: {
              create: {
                userId,
                role: Role.ADMIN,
              },
            },
          },
        });

        return reply.status(201).send(null);
      },
    });
};
