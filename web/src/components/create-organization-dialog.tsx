import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { PlusCircle } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useCreateOrganization } from "@/hooks/use-create-organization-dialog";
import { SubmitButton } from "./ui/submit-button";
import { Form } from "./ui/form";
import { InputField } from "./ui/field/input-field";

export const CreateOrganizationDialog = () => {
  const { form, onCreateOrganization, open, setOpen } = useCreateOrganization();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PlusCircle className="mr-2 size-4" />
          Adicionar
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova organização</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onCreateOrganization} className="grid gap-4 ">
            <InputField
              label="Nome da organização"
              placeholder="Ex: Centro Diagnóstico Galeão"
              name="name"
            />

            <DialogFooter>
              <SubmitButton content="Criar organização" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
