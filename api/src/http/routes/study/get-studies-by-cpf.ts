import { StudyStatus } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const getStudiesByCpf = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get("/studies/:cpf", {
    schema: {
      tags: ["Studies"],
      summary:
        "Buscar estudos de um paciente pelo CPF (opcional: apenas o último estudo)",
      params: z.object({
        cpf: z.string().min(11).max(14).describe("CPF do paciente"),
      }),
      querystring: z.object({
        latest: z
          .string()
          .optional()
          .transform((val) => val === "true" || val === "1"),
        status: z.nativeEnum(StudyStatus).optional(),
      }),
      response: {
        200: z.union([
          // ✅ Caso latest = true → retorna um estudo único (ou null)
          z
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

          z.array(
            z.object({
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
              attachments: z.array(
                z.object({
                  id: z.string(),
                  filename: z.string(),
                  url: z.string(),
                  size: z.number(),
                })
              ),
            })
          ),
        ]),
      },
    },

    handler: async (request, reply) => {
      const rawCpf = request.params.cpf.replace(/\D/g, "");
      const { latest, status } = request.query;

      const patient = await prisma.patient.findUnique({
        where: { cpf: rawCpf },
      });

      if (!patient) return reply.status(200).send(latest ? null : []);

      const baseWhere: any = {
        patientId: patient.id,
      };

      if (status) baseWhere.status = status;

      if (latest) {
        const study = await prisma.study.findFirst({
          where: baseWhere,
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

        return reply.status(200).send(study ?? null);
      }

      const studies = await prisma.study.findMany({
        where: baseWhere,
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

      return reply.status(200).send(studies);
    },
  });
};
