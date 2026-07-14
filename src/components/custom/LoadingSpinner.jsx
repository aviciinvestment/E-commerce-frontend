import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({
  promptText = "Processing data ledger parameters...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center gap-2.5">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {promptText}
      </p>
    </div>
  );
};
