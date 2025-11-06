import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import { Role } from "@prisma/client";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const deleteEquipment = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .delete(
      "/org/:slug/equipments/:equipmentId",
      {
        schema: {
          tags: ["Equipments"],
          summary: "Excluir equipamento",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            equipmentId: z.string(),
          }),
          response: { 204: z.null() },
        },
      },
      async (request, reply) => {
        const { slug, equipmentId } = request.params;
        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.ADMIN
        );

        const equipment = await prisma.equipment.findUnique({
          where: { id: equipmentId },
          select: { organizationId: true },
        });

        if (!equipment || equipment.organizationId !== organizationId)
          throw new BadRequestError("Equipamento não pertence à organização.");

        await prisma.equipment.delete({ where: { id: equipmentId } });

        return reply.status(204).send(null);
      }
    );
};
