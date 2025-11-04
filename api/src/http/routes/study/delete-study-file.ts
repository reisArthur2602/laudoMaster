// src/http/routes/studies/delete-study-file.ts
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getFtpClient } from "../../lib/ftp-client.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const deleteStudyFile = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .delete("/studies/:studyId/attachments/:attachmentId", {
      schema: {
        tags: ["Studies"],
        summary: "Remover anexo de um estudo ",
        security: [{ bearerAuth: [] }],
        params: z.object({
          studyId: z.string(),
          attachmentId: z.string(),
        }),
      },
      handler: async (req, reply) => {
        const { attachmentId } = req.params;

        const attachment = await prisma.studyAttachment.findUnique({
          where: { id: attachmentId },
        });

        if (!attachment) throw new BadRequestError("Anexo não encontrado");

        const client = await getFtpClient();
        await client.remove(attachment.path).catch(() => {});
        await prisma.studyAttachment.delete({ where: { id: attachmentId } });
        client.close();
        return reply.status(204).send();
      },
    });
};
