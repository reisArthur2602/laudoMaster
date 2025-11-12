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
            Envie um convite para adicionar um novo membro à sua organização.
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
                      <SelectTrigger className="w-full truncate wrap-break-word">
                        <SelectValue placeholder="Selecione o nível de acesso" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="ADMIN">
                          <span className="font-medium">Administrador —</span>{" "}
                          Acesso total à organização, membros e configurações.
                        </SelectItem>

                        <SelectItem value="LAUDO">
                          <span className="font-medium">Laudo —</span> Pode
                          visualizar e emitir laudos de exames DICOM.
                        </SelectItem>

                        <SelectItem value="TECHNICAL">
                          <span className="font-medium">Técnico —</span> Pode
                          enviar e visualizar exames externos (MAPA / HOLTER).
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <SubmitButton content="Enviar convite" disabled={loading} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
