//import React from "react";
import { XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorState = ({
  title = "Network Execution Failed",
  errorMessage = "Server responded with an unexpected status code layout error context.",
  onRetryAction,
}) => {
  return (
    <div className="bg-red-50/50 border border-red-100 rounded-xl p-8 text-center max-w-md mx-auto space-y-4">
      <div className="flex justify-center">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-red-900">{title}</h3>
        <p className="text-xs text-red-600/80 font-medium px-2 leading-relaxed">
          {errorMessage}
        </p>
      </div>
      {onRetryAction && (
        <Button
          onClick={onRetryAction}
          size="sm"
          className="bg-red-900 hover:bg-red-800 text-white gap-1.5 h-8 px-3 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
};
