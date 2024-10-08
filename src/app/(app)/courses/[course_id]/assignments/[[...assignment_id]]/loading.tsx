import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative flex h-full w-full space-y-0">
      <div className="relative grid h-full w-full shrink-0 grid-cols-2 gap-4 self-start xl:grid-cols-3">
        <div className="col-span-2 h-full w-full space-y-4">
          <Skeleton className="h-[700px] w-full shrink-0 rounded-md" />
        </div>
        <div className="order-first col-span-2 grid h-full w-full grid-cols-2 flex-col gap-4 self-start xl:order-last xl:col-span-1 xl:flex">
          <Skeleton className="col-span-1 h-[350px] w-full shrink-0 rounded-md" />
          <Skeleton className="col-span-1 h-[166px] w-full shrink-0 rounded-md" />
          <Skeleton className="col-span-1 h-[146px] w-full shrink-0 rounded-md" />
        </div>
      </div>
    </div>
  );
}
