import { Slash } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { TableLoading } from "./table-loading";

export const AppLoading = () => {
  return (
    <div className="min-h-screen">
      <header className="p-6 bg-muted/20">
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <Slash className="size-5 -rotate-20 text-border" />
            <Skeleton className="w-[220px] h-6" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <Slash className="size-5 -rotate-45 text-border" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>
      </header>
      <nav className="flex h-12 gap-2 border-b px-5 bg-muted/20">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-20 h-6" />
      </nav>
      <main className="mx-auto max-w-[1200px] w-full p-6 mt-4 flex-1">
        <TableLoading />
      </main>
    </div>
  );
};
