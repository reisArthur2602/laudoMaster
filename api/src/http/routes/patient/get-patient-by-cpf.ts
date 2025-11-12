import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z, { string } from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";

import { Role } from "@prisma/client";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const getPatientByCpf = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)

    .get("/patients/:cpf", {
      schema: {
        tags: ["Patients"],
        summary: "Buscar paciente pelo cpf",
        params: z.object({
          cpf: z.string(),
        }),
        response: {
          200: z
            .object({
              id: z.string(),
              name: z.string(),
              cpf: z.string(),
            })
            .nullable(),
        },
      },
      handler: async (request, reply) => {
        const { cpf } = request.params;
        const patient = await prisma.patient.findUnique({
          where: { cpf },
          select: {
            id: true,
            name: true,
            cpf: true,
          },
        });

        return reply.status(200).send(patient);
      },
    });
};
