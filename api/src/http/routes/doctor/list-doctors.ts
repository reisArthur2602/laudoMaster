import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import { Role } from "@prisma/client";

export const listDoctors = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/org/:slug/doctors",
      {
        schema: {
          tags: ["Doctors"],
          summary: "Listar médicos da organização",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),

          response: {
            200: z.array(
              z.object({
                id: z.string(),
                idMedico: z.number().nullable(),
                name: z.string(),
                specialty: z.string().nullable(),
                createdAt: z.date(),
                organizationId: z.string(),
              })
            ),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;

        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.ADMIN
        );

        const doctors = await prisma.doctor.findMany({
          where: { organizationId },
        });

        return reply.send(doctors);
      }
    );
};
