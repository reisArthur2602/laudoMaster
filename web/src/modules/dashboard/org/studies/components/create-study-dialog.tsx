import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/field/input-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ClipboardPlus } from "lucide-react";
import { useParams } from "react-router";
import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useCreateStudyDialog } from "../hooks/use-create-study-dialog";
import { PdfUploadField } from "@/components/pdf-upload-file";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const CreateStudyDialog = () => {
  const { orgSlug } = useParams();
  const { open, setOpen, form, onCreateStudy, patients, loading } =
    useCreateStudyDialog(orgSlug!);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <ClipboardPlus /> Novo Registro
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Registro Técnico</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Adicione um novo registro ou solicitação, com informações básicas e
            o documento PDF em anexo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onCreateStudy} className="grid gap-4 py-2">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loading
                              ? "Carregando..."
                              : "Selecione o responsável"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <InputField
              label="Descrição / Observação"
              name="description"
              placeholder="Ex: Revisão de cabeamento no setor administrativo"
            />

            <PdfUploadField name="file" label="Anexo (PDF)" />

            <DialogFooter>
              <SubmitButton content="Salvar Registro" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
