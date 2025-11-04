import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";

export const createDoctor = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/org/:slug/doctors",
      {
        schema: {
          tags: ["Doctors"],
          summary: "Criar novo médico",
          security: [{ bearerAuth: [] }],
          params: z.object({ slug: z.string() }),
          body: z.object({
            idMedico: z.number(),
            name: z.string(),
            crm: z.string().optional(),
            specialty: z.string().optional(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { idMedico, crm, specialty, name } = request.body;

        const { organizationId } = await request.requireOrgRole(
          slug,
          "SUPER_ADMIN"
        );

        await prisma.doctor.create({
          data: {
            name,
            idMedico,
            crm,
            specialty,
            organizationId,
          },
        });

        return reply.status(201).send(null);
      }
    );
};
