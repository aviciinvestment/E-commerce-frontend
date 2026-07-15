import { Card, CardContent } from "@/components/ui/card";

export const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {Array.from({ length: 8 }).map((_, idx) => (
        <Card
          key={idx}
          className="bg-white border-slate-200 shadow-none animate-pulse overflow-hidden"
        >
          <div className="bg-slate-100 h-40 w-full" />
          <CardContent className="p-4 space-y-2">
            <div className="h-3.5 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
