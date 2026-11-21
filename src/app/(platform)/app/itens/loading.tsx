import { Skeleton } from '@/components/ui/skeleton';

export default function ItemsLoading() {
  return (
    <div role="status" aria-label="Carregando" className="grid gap-6">
      <div className="grid gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-full md:w-72" />
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-44" />
      </div>
      <Skeleton className="h-[34rem] rounded-xl" />
    </div>
  );
}
