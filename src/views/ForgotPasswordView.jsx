import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordController } from "../controllers/useForgotPasswordController";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Mail, ArrowLeft, Loader2, Inbox } from "lucide-react";

export const ForgotPasswordView = () => {
  const [email, setEmail] = useState("");
  const { handleForgotPassword, loading, isEmailSent } =
    useForgotPasswordController();
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (email) {
      handleForgotPassword(email);
    }
  };

  // ⚡ DYNAMIC SUCCESS STATE: Renders instantly when backend verification clears
  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md shadow-lg border-slate-200 bg-white text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 animate-bounce">
                <Inbox className="w-12 h-12" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Reset Link Sent
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Please check your mailbox provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              We have dispatched password recovery configurations instructions
              to{" "}
              <span className="text-indigo-600 font-semibold break-all">
                {email}
              </span>
              . Click the link inside that message to safely establish a new
              password credential.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium"
            >
              Return to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // STANDARD INBOUND REQUEST FORM VIEW
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-indigo-600" />
            Recover Password
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Enter your registered account email address to receive a secure
            recovery link
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 focus-visible:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Recovery Link...
                </span>
              ) : (
                "Send Recovery Link"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs gap-1"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Account Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
