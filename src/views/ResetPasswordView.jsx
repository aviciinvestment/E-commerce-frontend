import { useState } from "react";
import { useResetPasswordController } from "../controllers/useResetPasswordController";
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
import { ShieldAlert, Lock, Loader2 } from "lucide-react";

export const ResetPasswordView = () => {
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const { handleResetPassword, loading } = useResetPasswordController();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (firstPassword && secondPassword) {
      handleResetPassword(firstPassword, secondPassword);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            Set New Password
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Establish your new account security parameters profile
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-4">
            {/* First Password Entry Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 focus-visible:ring-indigo-500"
                  value={firstPassword}
                  onChange={(e) => setFirstPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Second Password Confirmation Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 focus-visible:ring-indigo-500"
                  value={secondPassword}
                  onChange={(e) => setSecondPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            {/* Submission Action Execution Toggle Button */}
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password Credentials...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
