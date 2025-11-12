import { StudyStatus } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const getLastStudyByCpf = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get("/studies/:cpf", {
    schema: {
      tags: ["Studies"],
      summary: "Buscar último estudo disponível do paciente",
      params: z.object({
        cpf: z.string(),
      }),

      response: {
        200: z
          .object({
            id: z.string(),
            modality: z.string().nullable(),
            description: z.string().nullable(),
            status: z.nativeEnum(StudyStatus),
            studyId: z.string().nullable(),
            createdAt: z.date(),
            patient: z.object({
              id: z.string(),
              name: z.string(),
              cpf: z.string(),
            }),
            doctor: z
              .object({
                name: z.string(),
              })
              .nullable(),
            attachments: z
              .array(
                z.object({
                  id: z.string(),
                  filename: z.string(),
                  url: z.string(),
                  size: z.number(),
                })
              )
              .optional(),
          })
          .nullable(),
      },
    },

    handler: async (request, reply) => {
      const { cpf } = request.params;

      const study = await prisma.study.findFirst({
        where: { patient: { cpf }, status: "REPORTED" },
        include: {
          patient: true,
          doctor: { select: { name: true } },
          attachments: {
            select: {
              id: true,
              filename: true,
              url: true,
              size: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return reply.status(200).send(study);
    },
  });
};
