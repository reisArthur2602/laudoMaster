import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import { Role } from "@prisma/client";

export const createEquipment = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/org/:slug/equipments",
      {
        schema: {
          tags: ["Equipments"],
          summary: "Cadastrar novo equipamento",
          security: [{ bearerAuth: [] }],
          params: z.object({ slug: z.string() }),
          body: z.object({
            name: z.string().min(2),
            modality: z.string().optional(),
            manufacturer: z.string().optional(),
            model: z.string().optional(),
            serialNumber: z.string().optional(),
            location: z.string().optional(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { name, ...rest } = request.body;

        const { organizationId } = await request.requireOrgRole(
          slug,
          Role.SUPER_ADMIN
        );

        await prisma.equipment.create({
          data: {
            name,
            organizationId,
            ...rest,
          },
        });

        return reply.status(201).send(null);
      }
    );
};
