import { Form } from "@/components/ui/form";

import { useLoginForm } from "../hooks/use-login-form";
import { InputField } from "@/components/ui/field/input-field";
import { SubmitButton } from "@/components/ui/submit-button";

export const LoginForm = () => {
  
  const { form, onLogin } = useLoginForm();

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={onLogin}>
        <InputField name="email" placeholder="email@email.com" label="Email" />
        <InputField
          name="password"
          type="password"
          placeholder="******"
          label="Senha"
        />
        <SubmitButton content="Acessar" />
      </form>
    </Form>
  );
};
