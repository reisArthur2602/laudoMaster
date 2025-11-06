import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  const password = await hash("masterccm02", 6);

  const { id: userId } = await prisma.user.create({
    data: { email: "suporte@master.com", password, name: "Suporte" },
  });
  await prisma.user.create({
    data: { email: "laudo@master.com", password, name: "Laudo" },
  });
  await prisma.user.create({
    data: { email: "tecnico@master.com", password, name: "Técnico" },
  });

  await prisma.organization.create({
    data: {
      name: "Centro de imagem Galeão",
      slug: "centro-de-imagem-galeão",
      members: { create: { userId, role: "ADMIN" } },
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
