import { Link, useLocation } from "react-router";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";


export type TabsLinks = {
  href: string;
  label: string;
  allowed?: Roles[];
};

type Tabs = {
  links: TabsLinks[];
  currentRole?: Roles | null;
  checkPermission?: (allowed: Roles[]) => boolean;
  className?: string;
};

export const Tabs = ({ links, checkPermission, className }: Tabs) => {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  const visibleLinks = links.filter((link) => {
    if (!link.allowed || !checkPermission) return true;
    return checkPermission(link.allowed);
  });

  return (
    <nav
      className={cn(
        "flex h-12 gap-2 border-b px-5 bg-muted/20 overflow-x-auto scrollbar-none",
        className
      )}
    >
      {visibleLinks.map(({ href, label }) => (
        <Link
          key={href}
          to={href}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: cn(
              "text-muted-foreground/60 hover:text-secondary-foreground h-full rounded-none border-y-2 border-transparent text-sm font-medium transition-all hover:bg-transparent! whitespace-nowrap",
              isActive(href) &&
                "border-b-primary text-secondary-foreground duration-200"
            ),
          })}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
