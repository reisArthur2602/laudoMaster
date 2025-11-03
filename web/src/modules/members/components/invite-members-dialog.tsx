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
import { UserRoundPlusIcon } from "lucide-react";
import { useInviteMembersDialog } from "../hooks/use-invite-members-dialog";
import { useParams } from "react-router";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export const InviteMemberDialog = () => {
  const { orgSlug } = useParams();

  const { open, setOpen, form, onInviteMember, loading } =
    useInviteMembersDialog(orgSlug!);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserRoundPlusIcon /> Convidar membro
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar novo membro</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Envie um convite para adicionar um novo membro à sua organização
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onInviteMember} className="grid gap-4 py-2">
            <InputField
              label="E-mail do membro"
              name="email"
              placeholder="exemplo@dominio.com"
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Papel na organização</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o nível de acesso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">
                          Administrador — acesso total a configurações e membros
                        </SelectItem>
                        <SelectItem value="MEMBER">
                          Membro — pode visualizar e executar tarefas básicas
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <SubmitButton content="Enviar convite" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
