import { useFormContext } from "react-hook-form";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { toast } from "sonner";
import { FilePlus, Upload, UploadCloudIcon } from "lucide-react";

type PdfUploadFieldProps = {
  name: string;
  label?: string;
};

export const PdfUploadField = ({
  name,
  label = "Anexo (PDF)",
}: PdfUploadFieldProps) => {
  const { setValue, watch } = useFormContext();
  const file = watch(name) as File | undefined;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setValue(name, selectedFile);
    } else if (selectedFile) {
      toast.error("Apenas arquivos PDF são permitidos.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setValue(name, droppedFile);
    } else {
      toast.error("Apenas arquivos PDF são permitidos.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center transition-colors hover:border-primary/50 cursor-pointer relative "
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          {!file ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <FilePlus className="h-6 w-6 mb-1 text-primary" />
              <p className="text-sm">
                Arraste o arquivo aqui ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Apenas PDFs são aceitos
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-left">
              <div className="flex items-center space-x-2 text-primary font-medium">
                <UploadCloudIcon />
                <span>{file.name}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatFileSize(file.size)}
              </span>
            </div>
          )}
        </div>
      </FormControl>
    </FormItem>
  );
};
