import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  const password = await hash("masterccm02", 6);

  // === USERS ===
  const suporte = await prisma.user.upsert({
    where: { email: "suporte@master.com" },
    update: {},
    create: { email: "suporte@master.com", password, name: "Suporte" },
  });

  await prisma.user.upsert({
    where: { email: "laudo@master.com" },
    update: {},
    create: { email: "laudo@master.com", password, name: "Laudo" },
  });

  await prisma.user.upsert({
    where: { email: "tecnico@master.com" },
    update: {},
    create: { email: "tecnico@master.com", password, name: "Técnico" },
  });

  // === ORGANIZATION ===
  await prisma.organization.upsert({
    where: { slug: "centro-de-imagem-galeão" },
    update: {},
    create: {
      name: "Centro de imagem Galeão",
      slug: "centro-de-imagem-galeão",
      members: { create: { userId: suporte.id, role: "ADMIN" } },
      equipments: {
        createMany: {
          data: [
            { name: "KODAK" },
            { name: "Philips Healthcare" },
            { name: "SAMSUNG MEDISON CO., LTD" },
          ],
        },
      },
    },
  });

  console.log("✅ Seed concluído com sucesso!");
};

seed();
