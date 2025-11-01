import type { ComponentProps } from "react";
import { Button } from "./button";
import { useFormContext } from "react-hook-form";
import { Spinner } from "./spinner";

type Props = {
  content: string;
} & ComponentProps<"button">;

export const SubmitButton = ({ content, ...props }: Props) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button {...props} disabled={isSubmitting}>
      {isSubmitting ? (
        <div className="flex items-center gap-2">
          <Spinner /> Carregando...
        </div>
      ) : (
        content
      )}
    </Button>
  );
};
