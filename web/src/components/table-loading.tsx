import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  rows?: number;

  columns?: number;
};

export const TableLoading = ({ rows = 5, columns = 5 }: TableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border animate-pulse">
      <div className="bg-muted flex border-b border-border/40">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="flex-1 px-4 py-3 flex items-center justify-start"
          >
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>

      <div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex border-t border-border/40">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="flex-1 px-4 py-4 flex items-center justify-start"
              >
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
