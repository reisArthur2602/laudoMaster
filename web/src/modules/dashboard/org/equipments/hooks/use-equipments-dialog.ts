import { createEquipment } from '@/http/create-equipment';
import { queryClient } from '@/main';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const schema = z.object({
    name: z.string().min(2, 'O nome do equipamento é obrigatório.'),
    modality: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    serialNumber: z.string().optional(),
    location: z.string().optional(),
});

type EquipmentFormData = z.infer<typeof schema>;

export const useEquipmentsDialog = ({
    equipment,
    orgSlug,
}: {
    equipment?: Equipment;
    orgSlug: string;
}) => {
    const [open, setOpen] = useState(false);

    const form = useForm<EquipmentFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: equipment?.name || '',
            modality: equipment?.modality || '',
            manufacturer: equipment?.manufacturer || '',
            model: equipment?.model || '',
            serialNumber: equipment?.serialNumber || '',
            location: equipment?.location || '',
        },
    });

    const { mutateAsync: createEquipmentMutation } = useMutation({
        mutationFn: createEquipment,
        onSuccess: () => {
            toast.success('Equipamento cadastrado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['equipments', orgSlug] });
            setOpen(false);
            form.reset();
        },
    });

    const onCreateEquipment = form.handleSubmit((data) =>
        createEquipmentMutation({ slug: orgSlug, ...data })
    );

    const onEditEquipment = form.handleSubmit((data) => console.log({ slug: orgSlug, ...data }));

    return {
        open,
        setOpen,
        form,
        onCreateEquipment,
        onEditEquipment,
    };
};
