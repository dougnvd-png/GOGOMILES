import { Skeleton } from '@/components/ui/skeleton';

export default function PlatformLoading() {
  return (
    <div role="status" aria-label="Carregando" className="grid gap-6">
      <div className="grid gap-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {['a', 'b', 'c', 'd'].map((key) => (
          <Skeleton key={key} className="h-36 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-80 rounded-xl lg:col-span-8" />
        <Skeleton className="h-80 rounded-xl lg:col-span-4" />
      </div>
    </div>
  );
}
