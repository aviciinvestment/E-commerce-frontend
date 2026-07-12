import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck, ArrowRight, ArrowLeft } from "lucide-react";

export const EmailSentNotificationView = ({
  targetEmail = "your email address",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 bg-white text-center">
        <CardHeader className="space-y-2">
          {/* Visual Anchor Indicator Icon */}
          <div className="flex justify-center mb-2">
            <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 animate-pulse">
              <MailCheck className="w-12 h-12" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Check your Inbox
          </CardTitle>

          <CardDescription className="text-slate-500 text-sm">
            An account activation link has been dispatched
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
            We have sent a state-encrypted verification payload link to{" "}
            <span className="text-indigo-600 font-semibold break-all">
              {targetEmail}
            </span>
            . Please access your mailbox provider and click the link to
            initialize your credentials profile.
          </p>

          <div className="text-xs text-slate-400 space-y-1">
            <p>Didn't receive the mail? Check your spam folder.</p>
            <p>The registration activation link expires shortly.</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 w-full">
          {/* Main Redirect Action Call to Action */}
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            Go to Login Page
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Secondary safety navigation link */}
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="w-full text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to registration form
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
