import { useState } from "react";
import { toast } from "sonner";
import { attachStudyFile } from "@/http/attach-study-file";

export const useUploadAttachments = (studyId: string, orgSlug: string) => {
  const [uploading, setUploading] = useState(false);

  const onUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Envie um arquivo PDF válido.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      await attachStudyFile({ studyId, file, slug: orgSlug });
      toast.success("📄 PDF enviado com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao enviar o arquivo:", err);
      toast.error("Erro ao enviar o arquivo. Tente novamente.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return {
    uploading,
    onUploadFile,
  };
};
