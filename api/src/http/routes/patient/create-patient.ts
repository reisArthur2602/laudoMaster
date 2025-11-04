import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";

import { Role } from "@prisma/client";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const createPatient = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)

    .post("/org/:slug/patients", {
      schema: {
        tags: ["Patients"],
        summary: "Cadastrar um novo paciente",
        security: [{ bearerAuth: [] }],
        params: z.object({ slug: z.string() }),
        body: z.object({
          name: z.string().min(3, "Nome obrigatório"),
          cpf: z
            .string()
            .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos"),
          phone: z.string().optional(),
          birthDate: z.string().datetime().optional(),
          gender: z.string().optional(),
        }),
        response: { 201: z.null() },
      },
      handler: async (req, reply) => {
        const { slug } = req.params;
        const { name, cpf, phone, birthDate, gender } = req.body;

        const { organizationId } = await req.requireOrgRole(slug, [
          Role.MEMBER,
          Role.SUPER_ADMIN,
        ]);

        const exists = await prisma.patient.findUnique({ where: { cpf } });
        if (exists)
          throw new BadRequestError("Já existe um paciente com esse CPF.");

        await prisma.patient.create({
          data: {
            name,
            cpf,
            phone,
            gender,
            birthDate: birthDate ? new Date(birthDate) : null,
            organizationId,
          },
        });

        return reply.status(201).send();
      },
    });
};
