
"use client";

export const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse rounded-md bg-neutral-100 ${className}`} />
  );
};
