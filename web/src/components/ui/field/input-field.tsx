import { useFormContext } from "react-hook-form";

import type { ComponentProps } from "react";

import { Input } from "../input";
import { FormControl, FormField, FormItem, FormLabel } from "../form";

type Props = {
  name: string;
  label?: string;
} & ComponentProps<"input">;

export const InputField = ({ name, label, ...props }: Props) => {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Input {...field} {...props} disabled={isSubmitting} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
