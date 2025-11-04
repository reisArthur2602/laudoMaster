import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import { Role } from "@prisma/client";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const updateEquipment = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .put(
      "/equipments/:equipmentId",
      {
        schema: {
          tags: ["Equipments"],
          summary: "Editar equipamento",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            equipmentId: z.string(),
          }),
          body: z.object({
            name: z.string().optional(),
            modality: z.string().optional(),
            manufacturer: z.string().optional(),
            model: z.string().optional(),
            serialNumber: z.string().optional(),
            location: z.string().optional(),
          }),
          response: { 204: z.null() },
        },
      },
      async (request, reply) => {
        const { slug, equipmentId } = request.params;
        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.SUPER_ADMIN
        );

        const equipment = await prisma.equipment.findUnique({
          where: { id: equipmentId },
          select: { organizationId: true },
        });

        if (!equipment || equipment.organizationId !== organizationId)
          throw new BadRequestError("Equipamento não pertence à organização.");

        await prisma.equipment.update({
          where: { id: equipmentId },
          data: request.body,
          select: { id: true, name: true },
        });

        return reply.status(204).send(null);
      }
    );
};
