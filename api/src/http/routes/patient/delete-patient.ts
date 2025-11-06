import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";

import { Role } from "@prisma/client";

export const deletePatient = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .delete("/org/:slug/patients/:patientId", {
      schema: {
        tags: ["Patients"],
        summary: "Excluir paciente",
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          id: z.string(),
        }),
        response: { 204: z.null() },
      },
      handler: async (request, reply) => {
        const { slug, id } = request.params;
        const { organizationId } = await request.requireOrgRole(slug, [
          Role.ADMIN,
          Role.LAUDO,
          Role.TECHNICAL,
        ]);

        await prisma.patient.delete({
          where: { id, organizationId },
        });

        return reply.status(204).send(null);
      },
    });
};
