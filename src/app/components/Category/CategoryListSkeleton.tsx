import { Skeleton } from "./LoadingSkeleton";

export const CategoryListSkeleton = () => (
  <div className="p-3 space-y-2">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-9 w-full" />
    ))}
  </div>
);

export const FinalColumnSkeleton = () => (
  <div className="p-4 space-y-3">
    <Skeleton className="h-10 w-2/3" />
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-8 w-full" />
    ))}
  </div>
);
