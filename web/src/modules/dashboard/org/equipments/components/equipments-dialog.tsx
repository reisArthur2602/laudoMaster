import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { InputField } from '@/components/ui/field/input-field';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SubmitButton } from '@/components/ui/submit-button';
import { PlusCircleIcon } from 'lucide-react';

import { useParams } from 'react-router';
import { useEquipmentsDialog } from '../hooks/use-equipments-dialog';
import { EquipmentAlert } from './equipment-alert';

type EquipmentDialogProps = {
    equipment?: Equipment;
};

export const EquipmentDialog = ({ equipment }: EquipmentDialogProps) => {
    const { orgSlug } = useParams();
    const { open, setOpen, form, onCreateEquipment, onEditEquipment } = useEquipmentsDialog({
        equipment,
        orgSlug: orgSlug!,
    });

    const modalities = [
        { value: 'US', label: 'Ultrassom (US)' },
        { value: 'CT', label: 'Tomografia Computadorizada (CT)' },
        { value: 'MR', label: 'Ressonância Magnética (MR)' },
        { value: 'CR', label: 'Radiografia Computadorizada (CR)' },
        { value: 'DX', label: 'Raio-X Digital (DX)' },
        { value: 'MG', label: 'Mamografia (MG)' },
        { value: 'NM', label: 'Medicina Nuclear (NM)' },
        { value: 'XA', label: 'Angiografia (XA)' },
        { value: 'PT', label: 'PET (Tomografia por Emissão de Pósitrons)' },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircleIcon className="mr-1" /> Adicionar Equipamento
                </Button>
            </DialogTrigger>

            <DialogContent className=" p-0 ">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>
                        {equipment ? 'Editar Equipamento' : 'Novo Equipamento'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] px-6 pb-6">
                    <Form {...form}>
                        <form
                            onSubmit={equipment ? onEditEquipment : onCreateEquipment}
                            className="grid gap-6"
                        >
                            <EquipmentAlert />

                            <InputField
                                label="Nome do Equipamento"
                                name="name"
                                placeholder="Ex: Philips HD7"
                            />

                            <FormField
                                control={form.control}
                                name="modality"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Modalidade</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione a modalidade" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {modalities.map((m) => (
                                                    <SelectItem key={m.value} value={m.value}>
                                                        {m.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <InputField
                                label="Fabricante"
                                name="manufacturer"
                                placeholder="Ex: Philips, GE, Siemens..."
                            />

                            <InputField
                                label="Modelo"
                                name="model"
                                placeholder="Ex: HD7XE, SOMATOM Go"
                            />

                            <InputField
                                label="Número de Série"
                                name="serialNumber"
                                placeholder="Ex: SN123456789"
                            />

                            <InputField
                                label="Localização"
                                name="location"
                                placeholder="Ex: Sala 01, Setor Radiologia"
                            />

                            <DialogFooter>
                                <SubmitButton
                                    content={
                                        equipment ? 'Salvar Alterações' : 'Cadastrar Equipamento'
                                    }
                                />
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
