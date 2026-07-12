import { useState } from "react";
import { useAuthController } from "../contrloller/useAuthController";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { LogIn, Mail, Lock } from "lucide-react";

export const RegisterView = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { loading, error, handleRegister } = useAuthController();

  const onSubmit = (e) => {
    e.preventDefault();
    if (fullname && email && password && role) {
      handleRegister(fullname, email, password, role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <LogIn className="w-6 h-6 text-indigo-600" />
            REGISTER NOW
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to get a space in our Exclusive Store
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                FULL NAME
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="fullname"
                  className="pl-10"
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Role</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="user or vendor"
                  className="pl-10"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              disabled={loading}
            >
              {loading ? "Authenticating Session..." : "Sign In"}
            </Button>
            <p className="text-sm text-center text-slate-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-indigo-600 hover:underline font-medium"
              >
                login in here
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
