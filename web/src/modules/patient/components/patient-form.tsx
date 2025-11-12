import { InputField } from "@/components/ui/field/input-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { usePatientForm } from "../hooks/use-patient-form";
import { Input } from "@/components/ui/input";
import { maskCpf } from "@/utils/mask-cpf";
import { Button } from "@/components/ui/button";

export const PatientForm = () => {
  const { form, loading } = usePatientForm();
  return (
    <Form {...form}>
      <form className="grid gap-4">
        <FormField
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>

              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={14}
                  placeholder="000.000.000-00"
                  value={field.value}
                  disabled={loading}
                  onChange={(e) => field.onChange(maskCpf(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <InputField
          name="patientId"
          label="Senha de acesso"
          type="password"
          placeholder="******"
        />

        <Button>Acessar meu exame</Button>
      </form>
    </Form>
  );
};
