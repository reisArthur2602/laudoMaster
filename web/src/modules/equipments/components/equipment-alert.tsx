import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export const EquipmentAlert = () => {
  return (
    <Alert>
      <ShieldAlert />
      <AlertTitle>Importante — Cadastro do Equipamento</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          Os dados informados <strong>devem ser precisos</strong> e idênticos
          aos cadastrados no sistema <strong>Orthanc</strong>.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use o nome exato do equipamento configurado no PACS.</li>
          <li>Verifique a modalidade (US, CT, MR, etc.).</li>
          <li>Revise fabricante, modelo e número de série.</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
