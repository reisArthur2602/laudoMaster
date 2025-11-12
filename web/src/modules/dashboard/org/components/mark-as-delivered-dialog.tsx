import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router';
import { useMarkAsDeliveredDialog } from '../hooks/use-mark-as-delivered-dialog';

type MarkAsDeliveredDialog = {
    id: string;
};

export const MarkAsDeliveredDialog = ({ id }: MarkAsDeliveredDialog) => {
    const { orgSlug } = useParams();
    const { onMarkDelivered } = useMarkAsDeliveredDialog(orgSlug!);
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <CheckCircle2 className="size-4 mr-2" />
                    Marcar como Entregue
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar entrega</AlertDialogTitle>
                    <AlertDialogDescription>
                        Deseja realmente marcar este exame como <strong>entregue</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onMarkDelivered(id)}>
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
