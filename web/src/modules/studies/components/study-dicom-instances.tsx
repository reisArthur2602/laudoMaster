import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Image as ImageIcon } from "lucide-react";
import axios from "axios";

type StudyDicomInstancesProps = {
  instances: Study["instances"];
};

const ORTHANC_BASE_URL = "http://10.1.1.212:8042";
const ORTHANC_USERNAME = "admin";
const ORTHANC_PASSWORD = "Master@2025";

export const StudyDicomInstances = ({
  instances,
}: StudyDicomInstancesProps) => {
  async function openDicom(instanceUrl: string) {
    try {
      const response = await axios.get(instanceUrl, {
        responseType: "blob",
        auth: {
          username: ORTHANC_USERNAME,
          password: ORTHANC_PASSWORD,
        },
      });

      const blobUrl = URL.createObjectURL(response.data);
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error("Erro ao abrir imagem DICOM:", err);
      alert("Não foi possível carregar a imagem DICOM.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Ver Imagens
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Imagens DICOM</DialogTitle>
        </DialogHeader>

        {instances && instances.length > 0 ? (
          <ul className="space-y-2 mt-2">
            {instances.map((inst) => {
              const url = inst.previewUrl?.startsWith("http")
                ? inst.previewUrl
                : `${ORTHANC_BASE_URL}${inst.previewUrl}`;
              return (
                <li
                  key={inst.id}
                  className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <button
                      onClick={() => openDicom(url!)}
                      className="text-sm text-primary hover:underline"
                    >
                      {inst.id}
                    </button>
                  </div>

                  {inst.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(inst.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            Nenhuma imagem DICOM disponível.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
