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

const PORT = Number(process.env.PORT) || 3000;

const server = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);
server.setErrorHandler(errorHandler);

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? "my-secret-jwt",
});

server.register(fastifyCors, {
  origin: true,
});

server.register(fastifyMultipart);

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

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  server.log.info(`✅ Servidor rodando em http://localhost:${PORT}`);
  server.log.info(`📘 Documentação: http://localhost:${PORT}/docs`);
});
