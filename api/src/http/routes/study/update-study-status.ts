// src/http/routes/studies/update-study-status.ts
import { prisma } from "../../../database/prisma/prisma.js";
import { StudyStatus } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const updateStudyStatus = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch("/studies/:studyId/status", {
    schema: {
      tags: ["Studies"],
      summary: "Atualiza o status de um estudo (usado pelo tótem)",
      body: z.object({
        status: z.nativeEnum(StudyStatus),
        method: z.enum(["TOTEM", "PORTAL", "WHATSAPP"]).default("TOTEM"),
        recipient: z.string().optional(),
      }),
      params: z.object({ studyId: z.string() }),
      response: {
        200: z.null(),
      },
    },
    handler: async (req, reply) => {
      const { studyId } = req.params;
      const { status, method, recipient } = req.body;

      const study = await prisma.study.findUnique({ where: { id: studyId } });

      if (!study) throw new BadRequestError("Estudo não encontrado");

      await prisma.study.update({
        where: { id: studyId },
        data: { status },
      });

      if (status === "DELIVERED") {
        await prisma.studyDelivery.create({
          data: {
            studyId,
            method,
            recipient: recipient ?? "Paciente (tótem)",
            confirmed: true,
          },
        });
      }

      return reply.status(200).send(null);
    },
  });
};
