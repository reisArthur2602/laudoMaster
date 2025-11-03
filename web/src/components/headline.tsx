import type { ReactNode } from "react";

type Headline = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  type?: "section" | "default";
};

export const Headline = ({
  subtitle,
  title,
  children,
  type = "default",
}: Headline) => {
  return (
    <div className="flex justify-between">
      <div>
        {type === "default" ? <h3>{title}</h3> : <h4>{title}</h4>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};
