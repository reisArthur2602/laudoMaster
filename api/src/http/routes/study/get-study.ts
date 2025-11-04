// src/http/routes/studies/get-study.ts
import { StudyStatus } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error.js";

export const getStudy = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get("/org/:slug/studies/:studyId", {
      schema: {
        tags: ["Studies"],
        summary: "Obter detalhes de um estudo",
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          studyId: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            modality: z.string().nullable(),
            status: z.nativeEnum(StudyStatus),
            description: z.string().nullable(),
            attachments: z
              .array(
                z.object({
                  id: z.string(),
                  filename: z.string(),
                  url: z.string(),
                })
              )
              .optional(),
            patient: z
              .object({
                id: z.string(),
                name: z.string(),
                cpf: z.string(),
                phone: z.string().nullable(),
              })
              .optional(),
            instances: z
              .array(
                z.object({
                  id: z.string(),
                  dicomUid: z.string().nullable(),
                  previewUrl: z.string().nullable(),
                  dicomUrl: z.string().nullable(),
                })
              )
              .optional(),
          }),
        },
      },
      handler: async (request, reply) => {
        const { slug, studyId } = request.params;
        const { organizationId } = await request.getOrgMembershipBySlug(slug);

        const study = await prisma.study.findFirst({
          where: {
            id: studyId,
            organizationId,
          },
          include: {
            attachments: true,
            patient: true,
            instances: true,
          },
        });

        if (!study) {
          throw new BadRequestError("Estudo não encontrado");
        }

        return reply.status(200).send(study);
      },
    });
};
