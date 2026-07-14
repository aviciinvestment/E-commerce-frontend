import { useNavigate } from "react-router-dom";
import { useVerifyEmailController } from "../controllers/useVerifyEmailController";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

export const VerifyEmailView = () => {
  const { status, message } = useVerifyEmailController();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 bg-white text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            {status === "processing" && (
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
            )}
            {status === "error" && (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {status === "processing" && "Validating Link"}
            {status === "success" && "Account Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-slate-500">
            E-commerce account profile registration activation status
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {message}
          </p>
        </CardContent>

        <CardFooter>
          {status === "success" ? (
            // ⚡ THE REDIRECT ACTION BUTTON: Enabled instantly upon successful state resolution
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
              disabled={status === "processing"}
            >
              Back to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
