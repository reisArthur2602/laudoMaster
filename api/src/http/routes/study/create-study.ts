// @ts-nocheck

import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import crypto from "crypto";
import { getFtpClient } from "../../lib/ftp-client.js";
import { Readable } from "stream";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const createStudy = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post("/org/:slug/studies", {
      schema: {
        tags: ["Studies"],
        summary: "Criar novo estudo (exame) com anexo PDF",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },

      handler: async (request, reply) => {
        const { slug } = request.params;

        const file = await request.file();
        if (!file) throw new BadRequestError("Nenhum arquivo enviado");

        if (!file.mimetype.includes("pdf"))
          throw new BadRequestError("Somente PDFs são aceitos.");

        const fields = file.fields;

        const schema = z.object({
          patientId: z.string().min(1, "O paciente é obrigatório."),
          description: z.string().min(3, "Descrição é obrigatória."),
        });

        const { description, patientId } = schema.parse({
          patientId: fields.patientId?.value,
          description: fields.description?.value,
        });

        const membership = await request.getOrgMembershipBySlug(slug);
        const organizationId = membership.organizationId;

        const patient = await prisma.patient.findUnique({
          where: { id: patientId },
        });
        if (!patient) throw new BadRequestError("Paciente não encontrado.");

        const study = await prisma.study.create({
          data: {
            patientId,
            description,
            organizationId,
            status: "REPORTED",
            type: "EXTERNAL",
          },
        });

        const fileName = `${crypto.randomUUID()}_${file.filename.trim()}`;
        const remoteDir = `/public_html/uploads/studies`;
        const remotePath = `${remoteDir}/${fileName}`;

        const client = await getFtpClient();
        const buffer = await file.toBuffer();
        const stream = Readable.from(buffer);

        await client.ensureDir(remoteDir);
        await client.uploadFrom(stream, remotePath);

        await prisma.studyAttachment.create({
          data: {
            studyId: study.id,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.file.bytesRead,
            path: remotePath,
            url: `https://mastertelecom-claro.com.br/uploads/studies/${fileName}`,
          },
        });

        client.close();

        return reply.status(201).send(null);
      },
    });
};
