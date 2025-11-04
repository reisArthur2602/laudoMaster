import { PrismaClient, Role, StudyStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { fakerPT_BR as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed massivo e realista (6k exames)...");

  const hashed = await bcrypt.hash("123456", 10);

  // --- Usuários ---
  const usersData = [
    { name: "Administrador Master", email: "admin@master.com", role: Role.SUPER_ADMIN },
    { name: "Atendente Paula", email: "paula@master.com", role: Role.MEMBER },
  ];

  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
      },
    });
    users.push(user);
  }

  // --- Organização ---
  const org = await prisma.organization.upsert({
    where: { slug: "centro-clinico-galeao" },
    update: {},
    create: {
      name: "Centro Clínico Galeão",
      slug: "centro-clinico-galeao",
    },
  });

  // --- Membros obrigatórios ---
  for (const user of users) {
    await prisma.member.upsert({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: org.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        organizationId: org.id,
        role: user.role,
      },
    });
  }

  console.log(`🏢 Organização "${org.name}" configurada com ${users.length} membros.`);

  // --- Médicos ---
  const doctorsData = [
    { idMedico: 1001, name: "Dra. Mariana Silva", crm: "CRM-RJ 52133", specialty: "Radiologia" },
    { idMedico: 1002, name: "Dr. Ricardo Gomes", crm: "CRM-RJ 48221", specialty: "Tomografia" },
    { idMedico: 1003, name: "Dra. Juliana Costa", crm: "CRM-RJ 49322", specialty: "Mamografia" },
    { idMedico: 1004, name: "Dr. Felipe Moura", crm: "CRM-RJ 47799", specialty: "Ultrassonografia" },
    { idMedico: 1005, name: "Dr. André Faria", crm: "CRM-RJ 50511", specialty: "Ressonância Magnética" },
  ];

  const doctors = await Promise.all(
    doctorsData.map((d) =>
      prisma.doctor.upsert({
        where: { idMedico: d.idMedico },
        update: {},
        create: {
          idMedico: d.idMedico,
          name: d.name,
          crm: d.crm,
          specialty: d.specialty,
          organizationId: org.id,
        },
      })
    )
  );

  // --- Equipamentos ---
  const equipmentNames = [
    "GE Healthcare Optima CT660",
    "Philips Ingenia 1.5T MRI",
    "Samsung HS40 Ultrasound",
    "Kodak DirectView DR7500",
    "Siemens Mammomat Inspiration",
  ];

  const equipments: any[] = [];

  for (const name of equipmentNames) {
    let equipment = await prisma.equipment.findFirst({
      where: { name, organizationId: org.id },
    });

    if (!equipment) {
      equipment = await prisma.equipment.create({
        data: {
          name,
          manufacturer: name.split(" ")[0],
          organizationId: org.id,
        },
      });
    }

    equipments.push(equipment);
  }

  // --- Pacientes + Estudos ---
  const modalities = ["CT", "MR", "MG", "US", "CR"];
  const descriptions = [
    "Tomografia Computadorizada de Tórax",
    "Ressonância Magnética de Crânio",
    "Mamografia Digital Bilateral",
    "Ultrassonografia Abdominal Total",
    "Raio-X de Tórax PA",
  ];

  const total = 6000;
  const batchSize = 500;
  console.log(`👩‍⚕️ Criando ${total} pacientes e estudos em blocos de ${batchSize}...`);

  const allPatients: any[] = [];

  for (let i = 0; i < total; i++) {
    allPatients.push({
      name: faker.person.fullName(),
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      phone: faker.phone.number({ style: "national" }),
      gender: faker.person.sexType(),
      birthDate: faker.date.birthdate({ min: 18, max: 85, mode: "age" }),
      organizationId: org.id,
    });
  }

  // Cria pacientes em blocos
  for (let i = 0; i < allPatients.length; i += batchSize) {
    const chunk = allPatients.slice(i, i + batchSize);
    await prisma.patient.createMany({ data: chunk });
    console.log(`👥 ${i + chunk.length}/${total} pacientes criados...`);
  }

  // Recupera IDs para criar estudos
  const patients = await prisma.patient.findMany({
    where: { organizationId: org.id },
    select: { id: true },
  });

  const studiesData = patients.map((p) => {
    const doctor = faker.helpers.arrayElement(doctors);
    const equipment = faker.helpers.arrayElement(equipments);
    const modality = faker.helpers.arrayElement(modalities);
    const description = faker.helpers.arrayElement(descriptions);
    const status = faker.helpers.arrayElement(Object.values(StudyStatus));

    return {
      patientId: p.id,
      organizationId: org.id,
      doctorId: doctor.id,
      equipmentId: equipment.id,
      modality,
      description,
      status,
      createdAt: faker.date.recent({ days: 150 }),
    };
  });

  // Cria estudos em blocos
  for (let i = 0; i < studiesData.length; i += batchSize) {
    const chunk = studiesData.slice(i, i + batchSize);
    await prisma.study.createMany({ data: chunk });
    console.log(`🧾 ${i + chunk.length}/${total} estudos criados...`);
  }

  console.log("✅ Seed massivo concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
