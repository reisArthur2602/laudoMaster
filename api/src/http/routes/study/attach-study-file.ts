import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import crypto from "crypto";
import { getFtpClient } from "../../lib/ftp-client.js";
import { Readable } from "stream";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const attachStudyFile = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post("/studies/:studyId/attachments", {
      schema: {
        tags: ["Studies"],
        summary: "Anexar PDF a um estudo",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
        params: z.object({
          studyId: z.string(),
        }),
      },
      handler: async (request, reply) => {
        const { studyId } = request.params;
        const data = await request.file();

        if (!data) throw new BadRequestError("Nenhum arquivo enviado");
        if (!data.mimetype.includes("pdf"))
          throw new BadRequestError("Somente PDFs são aceitos");

        // Verifica estudo
        const study = await prisma.study.findUnique({ where: { id: studyId } });
        if (!study)
          throw new BadRequestError(
            "Estudo não encontrado para o ID informado."
          );

        const fileName = `${crypto.randomUUID()}_${data.filename.trim()}`;

        const remoteDir = `/public_html/uploads/studies`;
        const remotePath = `${remoteDir}/${fileName}`;

        console.log("📁 Preparando upload:", remotePath);

        const client = await getFtpClient();
        console.log("📡 FTP conectado");

        const buffer = await data.toBuffer();
        const stream = Readable.from(buffer);

        await client.ensureDir(remoteDir);
        await client.uploadFrom(stream, remotePath);
        console.log("✅ Upload concluído!");

        await prisma.studyAttachment.create({
          data: {
            studyId,
            filename: data.filename,
            mimeType: data.mimetype,
            size: data.file.bytesRead,
            path: remotePath,
            url: `https://mastertelecom-claro.com.br/uploads/studies/${fileName}`,
          },
        });

        client.close();
        console.log("📦 Arquivo registrado no banco!");
        return reply.status(201).send({ success: true });
      },
    });
};
