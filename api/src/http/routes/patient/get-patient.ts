import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";

import { Role } from "@prisma/client";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const getPatient = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)

    .get("/org/:slug/patients/:patientId", {
      schema: {
        tags: ["Patients"],
        summary: "Buscar paciente por ID (com estudos vinculados)",
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          patientId: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            cpf: z.string(),
            phone: z.string().nullable(),
            gender: z.string().nullable(),
            birthDate: z.date().nullable(),
            createdAt: z.date(),
            studies: z.array(
              z.object({
                id: z.string(),
                modality: z.string().nullable(),
                description: z.string().nullable(),
                status: z.string(),
                createdAt: z.date(),
              })
            ),
          }),
        },
      },
      handler: async (request, reply) => {
        const { slug, patientId } = request.params;

        const { organizationId } = await request.requireOrgRole(slug, [
          Role.MEMBER,
          Role.SUPER_ADMIN,
        ]);

        const patient = await prisma.patient.findFirst({
          where: { id: patientId, organizationId },
          include: {
            studies: {
              select: {
                id: true,
                modality: true,
                description: true,
                status: true,
                createdAt: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        });

        if (!patient) throw new BadRequestError("Paciente não encontrado.");

        return reply.status(200).send(patient);
      },
    });
};
