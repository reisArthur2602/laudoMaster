import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <section className="flex flex-col gap-4 text-center">
                <h1 className="text-9xl text-primary font-bold">404</h1>

                <div>
                    <h2 className="text-2xl font-semibold">Parece que você se perdeu...</h2>
                    <p className="text-muted-foreground">
                        A página que você está procurando não existe ou foi movida.
                    </p>
                </div>

                <Button onClick={() => navigate(-1)}>Voltar</Button>
            </section>
        </div>
    );
};
