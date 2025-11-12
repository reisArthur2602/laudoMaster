// src/http/routes/studies/update-study-status.ts
import { StudyStatus } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../../database/prisma/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const updateStudyStatus = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch("/studies/:studyId/status", {
    schema: {
      tags: ["Studies"],
      summary: "Alterar o status de um estudo",
      body: z.object({
        status: z.nativeEnum(StudyStatus),
      }),
      params: z.object({ studyId: z.string() }),
      response: {
        200: z.null(),
      },
    },
    handler: async (req, reply) => {
      const { studyId } = req.params;
      const { status } = req.body;

      const study = await prisma.study.findUnique({ where: { id: studyId } });
      if (!study) throw new BadRequestError("Estudo não encontrado");

      await prisma.study.update({
        where: { id: studyId },
        data: { status },
      });

      return reply.status(200).send(null);
    },
  });
};
