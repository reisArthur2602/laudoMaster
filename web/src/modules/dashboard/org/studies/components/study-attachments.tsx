import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Link } from "lucide-react";
import { UploadAttachments } from "./upload-attachments";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type StudyAttachments = {
  study: Study;
};

export const StudyAttachments = ({ study }: StudyAttachments) => {
  const attachments = study.attachments;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Link />
          Ver Anexos
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Anexos</DialogTitle>
        </DialogHeader>

        {attachments && attachments.length > 0 ? (
          <ul className="space-y-2">
            {attachments.map((att) => (
              <li
                key={att.id}
                className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {att.filename}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">
                  {(att.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum anexo disponível.
          </p>
        )}
        <DialogFooter>
          <UploadAttachments studyId={study.id} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
