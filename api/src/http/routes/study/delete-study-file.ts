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
    .delete("/org/:slug/attachments/:attachmentId", {
      schema: {
        tags: ["Studies"],
        summary: "Remover anexo de um estudo ",
        security: [{ bearerAuth: [] }],
        params: z.object({
          studyId: z.string(),
          attachmentId: z.string(),
          slug: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
      handler: async (req, reply) => {
        const { attachmentId, slug } = req.params;

        await req.getOrgMembershipBySlug(slug);

        const attachment = await prisma.studyAttachment.findUnique({
          where: { id: attachmentId, study: { organization: { slug } } },
        });

        if (!attachment) throw new BadRequestError("Anexo não encontrado");

        const client = await getFtpClient();
        await client.remove(attachment.path);
        await prisma.studyAttachment.delete({ where: { id: attachmentId } });
        client.close();

        return reply.status(204).send(null);
      },
    });
};
