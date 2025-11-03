// src/pages/ErrorPage.tsx
import { Button } from "@/components/ui/button";
import { useRouteError, useNavigate } from "react-router";
import { AlertTriangle } from "lucide-react";

export const ErrorPage = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <section className="flex flex-col items-center gap-6 text-center max-w-md">
        <AlertTriangle className="size-16 text-primary" />

        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Ocorreu um erro inesperado
          </h1>
          <p className="text-muted-foreground mt-2">
            Algo deu errado ao carregar esta página.
            {error?.statusText || error?.message
              ? ` (${error.statusText || error.message})`
              : ""}
          </p>
        </div>

        <div className="grid gap-2 grid-cols-2">
          <Button variant="default" onClick={() => navigate(0)}>
            Tentar novamente
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Voltar ao início
          </Button>
        </div>
      </section>
    </div>
  );
};
