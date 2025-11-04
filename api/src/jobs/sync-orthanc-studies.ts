import cron from "node-cron";
import { prisma } from "../database/prisma/prisma.js";
import {
  getInstances,
  getSeriesDetails,
  getStudiesCurrentDate,
  getStudyDetails,
} from "../services/orthanc.js";
import { getPatientData } from "../services/get-patient-data.js";

export const syncOrthancStudies = async () => {
  const studyIds = await getStudiesCurrentDate();

  if (!studyIds?.length) return;

  for (const studyId of studyIds) {
    try {
      // 🔍 Verifica duplicidade
      const studyExists = await prisma.study.findUnique({
        where: { orthancId: studyId },
      });
      if (studyExists) continue;

      // 📄 Detalhes do estudo
      const study = await getStudyDetails(studyId);
      if (!study?.PatientMainDicomTags?.PatientID) {
        console.warn(`⚠️ Estudo ${studyId} sem PatientID válido.`);
        continue;
      }


      const response = await getPatientData(
        study.PatientMainDicomTags.PatientID
      );
      
      if (!response) continue;

      const {
        nascimento,
        descricaoservico,

        nomemedico,
        telefone2,
        nomepaciente,
        telefone,
        cpf,
        especialidade,
        idmedico,
      } = response;

      // 🧩 Verifica séries
      const firstSerie = study.Series?.[0];
      if (!firstSerie) continue;

      const { MainDicomTags: serieMainDicomTags } = await getSeriesDetails(
        firstSerie
      );

      const organizationWithSameEquipment = await prisma.equipment.findFirst({
        where: {
          name:
            serieMainDicomTags.Manufacturer || serieMainDicomTags.StationName,
        },
        include: { organization: true },
      });

      if (!organizationWithSameEquipment) continue;

      const { organizationId } = organizationWithSameEquipment;

      const instancesData = await getInstances(studyId);
      if (!instancesData.length) continue;

      let birthDate = null;

      if (nascimento && nascimento.includes("-")) {
        const [day, month, year] = nascimento.split("-");
        birthDate = new Date(`${year}-${month}-${day}`);
      }

      const doctor = await prisma.doctor.upsert({
        where: { idMedico: idmedico },
        update: {
          specialty: especialidade || null,
        },
        create: {
          name: nomemedico,
          idMedico: idmedico,
          specialty: especialidade || null,
          organizationId,
        },
      });

      // 👨‍⚕️ 2️⃣ Upsert paciente
      const patient = await prisma.patient.upsert({
        where: { cpf },
        update: {},
        create: {
          cpf,
          name: nomepaciente?.trim() || "Paciente Desconhecido",
          birthDate,
          phone: telefone?.trim() || telefone2?.trim() || null,
          organizationId,
        },
      });

      // 🧾 3️⃣ Cria estudo com médico vinculado
      await prisma.study.create({
        data: {
          orthancId: studyId,
          patientId: patient.id,
          doctorId: doctor.id,
          description: descricaoservico?.trim() || "Sem descrição",
          modality: serieMainDicomTags.Modality,
          status: "PENDING",
          organizationId,
          instances: {
            createMany: {
              data: instancesData.map((instance) => ({
                previewUrl: instance.previewURL,
                dicomUrl: instance.dicomURL,
              })),
            },
          },
        },
      });

      console.log(
        `✅ Estudo sincronizado: ${nomepaciente} (${cpf}) | Dr(a). ${nomemedico} (${idmedico}) | ${
          descricaoservico || serieMainDicomTags.Modality
        }`
      );
    } catch (err) {
      console.error(`❌ Erro ao processar estudo ${studyId}`);
    }
  }

  console.log("🏁 Sincronização Orthanc concluída com sucesso.");
};

// ⏱️ Executa a cada 10 minutos
cron.schedule("*/10 * * * *", async () => {
  console.log("⏱️ Executando sincronização automática com Orthanc...");
  await syncOrthancStudies();
});
