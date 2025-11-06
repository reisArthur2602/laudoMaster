import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import { Role } from "@prisma/client";

export const listEquipments = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/org/:slug/equipments",
      {
        schema: {
          tags: ["Equipments"],
          summary: "Listar equipamentos da organização",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                modality: z.string().nullable(),
                manufacturer: z.string().nullable(),
                model: z.string().nullable(),
                serialNumber: z.string().nullable(),
                location: z.string().nullable(),
                createdAt: z.date(),
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

        const equipments = await prisma.equipment.findMany({
          where: { organizationId },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            modality: true,
            manufacturer: true,
            model: true,
            serialNumber: true,
            location: true,
            createdAt: true,
          },
        });

        return reply.send(equipments);
      }
    );
};
