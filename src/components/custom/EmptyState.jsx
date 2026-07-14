import { AlertCircle } from "lucide-react";

export const EmptyState = ({
  title = "No Records Found",
  description = "The requested catalog query returned zero matching parameters in the database snapshot.",
}) => {
  return (
    <div className="border border-dashed border-slate-200 bg-white rounded-xl p-12 text-center max-w-md mx-auto space-y-3">
      <div className="flex justify-center">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
          <AlertCircle className="w-6 h-6" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed px-4">
          {description}
        </p>
      </div>
    </div>
  );
};
