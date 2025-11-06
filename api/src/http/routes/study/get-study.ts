// src/http/routes/studies/get-study.ts
import { StudyStatus } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

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
          200: z
            .object({
              id: z.string(),
              modality: z.string().nullable(),
              studyId: z.string().nullable(),
              status: z.nativeEnum(StudyStatus),
              description: z.string().nullable(),
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
                })
              ),
              patient: z.object({
                id: z.string(),
                name: z.string(),
                cpf: z.string(),
                phone: z.string().nullable(),
              }),
            })
            .nullable(),
        },
      },
      handler: async (request, reply) => {
        const { slug, studyId } = request.params;
        const { organizationId } = await request.getOrgMembershipBySlug(slug);

        const study = await prisma.study.findUnique({
          where: {
            id: studyId,
            organizationId,
          },
          select: {
            id: true,
            modality: true,
            status: true,
            studyId: true,
            description: true,
            attachments: {
              select: { id: true, filename: true, url: true, size: true },
            },
            patient: {
              select: { id: true, name: true, cpf: true, phone: true },
            },
            doctor: { select: { name: true } },
          },
        });

        return reply.status(200).send(study);
      },
    });
};
