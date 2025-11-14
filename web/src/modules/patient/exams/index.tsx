import { Headline } from '@/components/headline';
import { Logo } from '@/components/logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/format-date';
import { Download, DownloadCloud, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router';

const exam = {
    id: 'exam-001',
    modality: 'US',
    description: 'Ultrassonografia de Abdômen Total',
    status: 'PENDING',
    studyId: 'STUDY-ABC123',
    createdAt: '2025-11-10T15:17:15.511Z',
    patient: {
        id: 'patient-001',
        name: 'João da Silva',
        cpf: '123.456.789-00',
    },
    doctor: {
        name: 'Dr. Carlos Alberto',
    },
    attachments: [
        {
            id: 'att-001',
            filename: 'abdomen_ultrassom.png',
            url: 'https://placehold.co/600x400/png?text=Ultrassom+Abdômen',
            size: 184523,
        },
        {
            id: 'att-002',
            filename: 'laudo_ultrassom.pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            size: 45612,
        },
    ],
};

export const ExamsPage = () => {
    return (
        <div className="mx-auto w-full flex flex-col">
            <header className="p-6  bg-muted/20 border-b ">
                <div className="mx-auto flex items-center justify-between">
                    <Logo />

                    <Link to="" className={buttonVariants({ variant: 'outline' })}>
                        Sair
                    </Link>
                </div>
            </header>

            <main className="flex flex-col gap-4 max-w-[1200px] mx-auto w-full p-8">
                <Headline
                    title="Acompanhe seus exames online"
                    subtitle="Consulte laudos, imagens e documentos de forma simples e segura, direto da sua área do paciente."
                />

                {exam && (
                    <Card className="overflow-hidden  transition-all duration-300 border-border p-0 size-fit">
                        <CardContent className="p-0">
                            <div className="aspect-video bg-muted flex items-center justify-center hover:animate-pulse cursor-pointer">
                                <FileText className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <h4>{exam.description}</h4>

                                <div className="flex flex-col mb-4">
                                    <span className="text-muted-foreground text-sm font-medium">
                                        {exam.doctor.name}
                                    </span>
                                    <span className="text-muted-foreground text-sm font-medium">
                                        {formatDate(exam.createdAt)}
                                    </span>
                                </div>

                                {!exam.studyId ? (
                                    <Button className={buttonVariants({ className: 'w-full' })}>
                                        <DownloadCloud className="mr-2" />
                                        Baixar Exame
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link
                                            to="http://10.1.1.145:5000/viewer_pro.html?study=024832bf-e48f829c-ebf13a87-a9b7b391-4cccf628"
                                            className={buttonVariants({
                                                className: 'flex-1',
                                                size: `sm`,
                                            })}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Visualizar
                                        </Link>
                                        <Button variant="outline" size={`sm`}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
};
