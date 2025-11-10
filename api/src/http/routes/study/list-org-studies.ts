import { StudyStatus, StudyType } from "@prisma/client";
import { prisma } from "../../../database/prisma/prisma.js";
import { authPlugin } from "../../plugins/auth.js";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const listOrgStudies = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get("/org/:slug/studies", {
      schema: {
        tags: ["Studies"],
        summary: "Listar estudos de uma organização (com filtro opcional por tipo)",
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          type: z.nativeEnum(StudyType).optional(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              modality: z.string().nullable(),
              type: z.nativeEnum(StudyType),
              status: z.nativeEnum(StudyStatus),
              createdAt: z.date(),
              studyId: z.string().nullable(),
              description: z.string().nullable(),
              patient: z.object({
                name: z.string(),
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
        },
      },

      handler: async (request, reply) => {
        const { slug } = request.params;
        const { type } = request.query; 
        const { organizationId } = await request.getOrgMembershipBySlug(slug);

        const studies = await prisma.study.findMany({
          where: {
            organizationId,
            ...(type ? { type } : {}),
          },
          select: {
            id: true,
            modality: true,
            type: true,
            status: true,
            description: true,
            createdAt: true,
            studyId: true,
            patient: {
              select: {
                name: true,
              },
            },
            doctor: {
              select: {
                name: true,
              },
            },
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
