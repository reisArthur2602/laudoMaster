import { StudyStatus } from "@prisma/client";
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
        summary: "Listar estudos de uma organização",
        security: [{ bearerAuth: [] }],
        params: z.object({ slug: z.string() }),

        response: {
          200: z.array(
            z.object({
              id: z.string(),
              modality: z.string().nullable(),
              status: z.nativeEnum(StudyStatus),
              createdAt: z.date(),
              patient: z.object({ name: z.string() }),
              doctor: z.object({
                name: z.string(),
              }),

              attachments: z.array(
                z.object({
                  id: z.string(),
                  filename: z.string(),
                  url: z.string(),
                  size: z.number(),
                })
              ),
              instances: z.array(
                z.object({
                  id: z.string(),
                  previewUrl: z.string(),
                  dicomUrl: z.string(),
                  createdAt: z.date(),
                })
              ),
            })
          ),
        },
      },
      handler: async (request, reply) => {
        const { slug } = request.params;
        const { organizationId } = await request.getOrgMembershipBySlug(slug);

        const studies = await prisma.study.findMany({
          where: {
            organizationId,
          },
          select: {
            id: true,
            modality: true,
            status: true,
            createdAt: true,
            patient: { select: { name: true } },
            attachments: {
              select: { id: true, filename: true, url: true, size: true },
            },
            doctor: {
              select: {
                name: true,
              },
            },
            instances: {
              select: {
                id: true,
                dicomUrl: true,
                previewUrl: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return reply.status(200).send(studies);
      },
    });
};
