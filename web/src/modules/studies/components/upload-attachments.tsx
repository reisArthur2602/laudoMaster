import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useRef } from "react";
import { useUploadAttachments } from "../hooks/use-upload-attachments";

type UploadAttachments = { studyId: string };

export const UploadAttachments = ({ studyId }: UploadAttachments) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, onUploadFile } = useUploadAttachments(studyId);

  return (
    <div className="flex justify-end">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onUploadFile}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Enviando...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Adicionar PDF
          </>
        )}
      </Button>
    </div>
  );
};
