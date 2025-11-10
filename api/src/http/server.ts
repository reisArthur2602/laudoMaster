import "dotenv/config";

import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { fastifyMultipart } from "@fastify/multipart";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { errorHandler } from "./routes/error-handler.js";
import { login } from "./routes/auth/login.js";
import { getUserProfile } from "./routes/auth/get-user-profile.js";
import { createInvite } from "./routes/invite/create-invite.js";
import { listUserInvites } from "./routes/invite/list-user-invites.js";
import { rejectInvite } from "./routes/invite/reject-invite.js";
import { acceptInvite } from "./routes/invite/accept-invite.js";
import { listMembers } from "./routes/member/list-members.js";
import { updateMemberRole } from "./routes/member/update-member-role.js";
import { removeMember } from "./routes/member/remove-member.js";
import { createOrganization } from "./routes/org/create-organization.js";
import { listOrganizations } from "./routes/org/list-organization.js";
import { removeOrganization } from "./routes/org/remove-organization.js";
import { getMyMembership } from "./routes/member/get-my-membership.js";
import { listEquipments } from "./routes/equipment/list-equipments.js";
import { deleteEquipment } from "./routes/equipment/delete-equipment.js";
import { updateEquipment } from "./routes/equipment/update-equipment.js";
import { createEquipment } from "./routes/equipment/create-equipment.js";
import { createPatient } from "./routes/patient/create-patient.js";
import { listOrgPatients } from "./routes/patient/list-org-patients.js";
import { deletePatient } from "./routes/patient/delete-patient.js";
import { getPatient } from "./routes/patient/get-patient.js";
import { listOrgStudies } from "./routes/study/list-org-studies.js";
import { getStudy } from "./routes/study/get-study.js";
import { attachStudyFile } from "./routes/study/attach-study-file.js";
import { deleteStudyFile } from "./routes/study/delete-study-file.js";
import { updateStudyStatus } from "./routes/study/update-study-status.js";
import { syncOrthancStudies } from "../jobs/sync-orthanc-studies.js";
import { overviewOrganization } from "./routes/org/overview-organization.js";
import { getStudiesByCpf } from "./routes/study/get-studies-by-cpf.js";
import { createDoctor } from "./routes/doctor/create-doctor.js";
import { listDoctors } from "./routes/doctor/list-doctors.js";
import { deleteDoctor } from "./routes/doctor/delete-doctor.js";
import { createStudy } from "./routes/study/create-study.js";

const PORT = Number(process.env.PORT) || 3000;

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);
server.setErrorHandler(errorHandler);

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? "my-secret-jwt",
});

server.register(fastifyCors, {
  origin: true,
});



server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Central de Imagens Médicas — API",
      version: "1.0.0",
      description:
        "API para **centralização e gerenciamento de imagens médicas** integradas ao **Orthanc**. ",
    },
    servers: [],

    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },

    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
});

server.register(fastifyMultipart, {
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1,
    fields: 10,
  },
});
server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.register(login);
server.register(getUserProfile);

server.register(createInvite);
server.register(listUserInvites);
server.register(rejectInvite);
server.register(acceptInvite);

server.register(listMembers);
server.register(updateMemberRole);
server.register(removeMember);
server.register(getMyMembership);

server.register(createOrganization);
server.register(listOrganizations);
server.register(removeOrganization);
server.register(overviewOrganization);

server.register(listEquipments);
server.register(createEquipment);
server.register(deleteEquipment);
server.register(updateEquipment);

server.register(createPatient);
server.register(listOrgPatients);
server.register(deletePatient);
server.register(getPatient);
server.register(getStudiesByCpf);

server.register(listOrgStudies);
server.register(getStudy);
server.register(attachStudyFile);
server.register(deleteStudyFile);
server.register(updateStudyStatus);
server.register(createStudy);

server.register(createDoctor);
server.register(listDoctors);
server.register(deleteDoctor);

server.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📘 Documentação: http://localhost:${PORT}/docs`);
  syncOrthancStudies();
});
