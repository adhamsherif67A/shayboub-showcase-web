import { Skeleton } from "@/components/ui/skeleton";

interface MenuSkeletonProps {
  count?: number;
}

export const MenuItemSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border">
    {/* Image skeleton */}
    <Skeleton className="aspect-square w-full" />
    
    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <Skeleton className="h-4 w-3/4" />
      {/* Description */}
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      {/* Price */}
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export const MenuGridSkeleton = ({ count = 8 }: MenuSkeletonProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <MenuItemSkeleton key={i} />
    ))}
  </div>
);

export const CategoryTabsSkeleton = () => (
  <div className="flex gap-2 pb-4 mb-10 overflow-hidden">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton 
        key={i} 
        className="h-10 w-24 rounded-full shrink-0" 
        style={{ animationDelay: `${i * 100}ms` }}
      />
    ))}
  </div>
);

export const MenuSectionSkeleton = () => (
  <section className="px-6 py-20 md:px-12 lg:px-24 lg:py-28">
    <div className="max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="text-center mb-12">
        <Skeleton className="h-4 w-32 mx-auto mb-4" />
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto max-w-full" />
      </div>
      
      {/* Category tabs skeleton */}
      <CategoryTabsSkeleton />
      
      {/* Category title skeleton */}
      <Skeleton className="h-8 w-40 mb-8" />
      
      {/* Grid skeleton */}
      <MenuGridSkeleton count={8} />
    </div>
  </section>
);
