import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Eye } from "lucide-react";
import { EquipmentAlert } from "./equipment-alert";
import { ScrollArea } from "@/components/ui/scroll-area";

type ViewEquipment = {
  equipment: Equipment;
};

export const ViewEquipmentDialog = ({ equipment }: ViewEquipment) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye className="size-4 mr-2" />
          Ver detalhes
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{equipment.name}</DialogTitle>
          <DialogDescription>
            Visualize todos os detalhes deste equipamento.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 h-full">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 text-sm *:py-2">
              <p className="text-muted-foreground">Modalidade:</p>
              <p className="text-end font-medium text-foreground">
                {equipment.modality || "-"}
              </p>

              <p className="text-muted-foreground">Fabricante:</p>
              <p className="text-end font-medium text-foreground">
                {equipment.manufacturer || "-"}
              </p>

              <p className="text-muted-foreground">Modelo:</p>
              <p className="text-end font-medium text-foreground">{equipment.model || "-"}</p>

              <p className="text-muted-foreground">Número de Série:</p>
              <p className="text-end font-medium text-foreground">
                {equipment.serialNumber || "-"}
              </p>

              <p className="text-muted-foreground">Localização:</p>
              <p className="text-end font-medium text-foreground">
                {equipment.location || "-"}
              </p>

              <p className="text-muted-foreground">Cadastrado em:</p>
              <p className="text-end font-medium text-foreground">
                {new Date(equipment.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <EquipmentAlert />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
