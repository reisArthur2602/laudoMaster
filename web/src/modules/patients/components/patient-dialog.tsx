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
import { User } from "lucide-react";
import { useParams } from "react-router";
import { Form } from "@/components/ui/form";
import { usePatientDialog } from "../hooks/use-patient-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useCallback } from "react";

const maskCpf = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);

const maskPhone = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2")
    .substring(0, 15);

const maskDate = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .substring(0, 10);

export const PatientDialog = () => {
  const { orgSlug } = useParams();
  const { open, setOpen, form, onCreatePatient } = usePatientDialog(orgSlug!);

  const handleCpfChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskCpf(e.target.value);
      form.setValue("cpf", masked);
    },
    [form]
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskPhone(e.target.value);
      form.setValue("phone", masked);
    },
    [form]
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskDate(e.target.value);
      form.setValue("birthDate", masked);
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <User /> Adicionar Paciente
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Paciente</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Cadastre um novo paciente para associar exames e laudos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onCreatePatient} className="grid gap-4 py-2">
            <InputField
              label="Nome completo"
              name="name"
              placeholder="Ex: João da Silva"
            />

            <InputField
              label="CPF"
              name="cpf"
              placeholder="000.000.000-00"
              onChange={handleCpfChange}
              value={form.watch("cpf")}
            />

            <InputField
              label="Telefone"
              name="phone"
              placeholder="(11) 99999-9999"
              onChange={handlePhoneChange}
              value={form.watch("phone")}
            />

            <InputField
              label="Data de nascimento"
              name="birthDate"
              placeholder="DD/MM/AAAA"
              onChange={handleDateChange}
              value={form.watch("birthDate")}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter>
              <SubmitButton content="Cadastrar Paciente" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
