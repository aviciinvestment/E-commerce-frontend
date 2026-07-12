import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginController } from "../contrloller/useLoginController";
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
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";

export const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, loading } = useLoginController();
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      handleLogin(email.trim(), password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <LogIn className="w-6 h-6 text-indigo-600" />
            Account Sign In
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Enter your email and password credentials to access your store
            profile
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-4">
            {/* Email Field Wrapper Input */}
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

            {/* Password Field Wrapper Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-indigo-600 hover:underline font-medium bg-transparent border-0 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 focus-visible:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {/* Form Execution Action Button */}
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating Profile...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-sm text-center text-slate-500">
              New customer?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-600 hover:underline font-medium bg-transparent border-0 cursor-pointer"
              >
                Create account
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
