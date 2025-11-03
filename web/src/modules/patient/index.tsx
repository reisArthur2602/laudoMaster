import { useParams, useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Phone, Cake, User } from "lucide-react";
import { usePatient } from "./hooks/use-patient";
import { formatStudyStatus } from "@/utils/format-study-status";

const mockStudies = [
  {
    id: "1",
    description: "Ultrassom de Abdômen Total",
    modality: "US",
    status: "REPORTED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    description: "Raio-X de Tórax",
    modality: "CR",
    status: "DELIVERED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    description: "Ressonância Magnética de Joelho",
    modality: "MR",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
];

const calcAge = (birthDate?: string | null) => {
  if (!birthDate) return "-";
  const diff = Date.now() - new Date(birthDate).getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return `${age} anos`;
};

export const PatientPage = () => {
  const navigate = useNavigate();
  const { orgSlug, patientId } = useParams();
  const { patient, loading } = usePatient(orgSlug!, patientId!);

  if (loading)
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>

        <Skeleton className="h-[350px] w-full rounded-md" />
      </div>
    );

  if (!patient)
    return (
      <div className="text-center text-muted-foreground p-6">
        Paciente não encontrado.
      </div>
    );

  return (
    <div className="space-y-6">
      <Button variant="link" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="size-4" />
        Voltar
      </Button>

      <header className="border-b pb-4">
        <h3 className="capitalize">{patient.name}</h3>
        <p className="text-muted-foreground text-sm mt-1">
          CPF:{" "}
          {patient.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")} •{" "}
          {calcAge(patient.birthDate)}
        </p>
      </header>

      <section className="space-y-3 text-sm">
        <h4>Informações Pessoais</h4>

        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 border border-border/50 rounded-xl p-4 bg-card/50">
          <Info
            icon={<Phone className="size-4 text-primary" />}
            label="Telefone"
            value={patient.phone || "-"}
          />
          <Info
            icon={<CalendarDays className="size-4 text-primary" />}
            label="Cadastrado em"
            value={new Date(patient.createdAt).toLocaleDateString("pt-BR")}
          />
          <Info
            icon={<Cake className="size-4 text-primary" />}
            label="Nascimento"
            value={
              patient.birthDate
                ? new Date(patient.birthDate).toLocaleDateString("pt-BR")
                : "-"
            }
          />
          <Info
            icon={<User className="size-4 text-primary" />}
            label="Gênero"
            value={
              patient.gender === "M"
                ? "Masculino"
                : patient.gender === "F"
                ? "Feminino"
                : "Outro"
            }
          />
        </div>
      </section>

      <section className="space-y-3 ">
        <div className="flex items-center justify-between">
          <h4>Histórico de Exames</h4>
        </div>

        <ScrollArea className="h-[300px] rounded-sm border border-border/60 p-4 pr-4 bg-card/50">
          {mockStudies.length > 0 ? (
            <div className="space-y-3">
              {mockStudies.map((study) => (
                <div
                  key={study.id}
                  className="rounded-md border border-border/50 p-4 hover:bg-muted/40 transition last:mb-0"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-foreground">
                      {study.description || "Sem descrição"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(study.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <p>Modalidade: {study.modality || "-"}</p>
                    <p>{formatStudyStatus(study.status)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Nenhum exame disponível.
            </p>
          )}
        </ScrollArea>
      </section>
    </div>
  );
};

const Info = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-md bg-muted/40">{icon}</div>
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  </div>
);
