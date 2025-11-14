import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import { Role } from "@prisma/client";

export const deleteDoctor = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .delete(
      "/org/:slug/doctors/:doctorId",
      {
        schema: {
          tags: ["Doctors"],
          summary: "Excluir médico da organização",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            id: z.string(),
          }),
          response: { 204: z.null() },
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params;

        await request.requireOrgRole(slug, Role.ADMIN);

        await prisma.doctor.delete({
          where: { id },
        });

        return reply.status(204).send();
      }
    );
};
