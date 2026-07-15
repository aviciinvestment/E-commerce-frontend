//import React from "react";
import { useProfileController } from "../controllers/useProfileController";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, KeyRound, MapPin, Trash2, Mail, Loader2 } from "lucide-react";

export const ProfileView = ({ userContextData, onRefreshProfileData }) => {
  const {
    fullname,
    setFullname,
    email,
    setEmail,
    profileLoading,
    handleUpdateProfile,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordLoading,
    handleChangePassword,
    handleDeleteAddress,
  } = useProfileController(userContextData?.profile, onRefreshProfileData);

  const addresses = userContextData?.addresses || [];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <User className="w-4 h-4 text-indigo-600" />
              Personal Identity Parameters
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Modify your core account profile credentials and electronic mail
              strings
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    className="pl-10 h-10 text-xs shadow-none"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    disabled={profileLoading}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    className="pl-10 h-10 text-xs shadow-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={profileLoading}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4">
              <Button
                type="submit"
                size="sm"
                className="ml-auto bg-slate-900 text-white hover:bg-slate-800 text-xs shadow-none h-9 px-4 font-bold"
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Personal Info"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              Account Password Reset
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Establish a new cryptographed account passcode barrier key profile
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleChangePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-9 text-xs shadow-none"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-9 text-xs shadow-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-9 text-xs shadow-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4">
              <Button
                type="submit"
                size="sm"
                className="ml-auto bg-slate-900 text-white hover:bg-slate-800 text-xs shadow-none h-9 px-4 font-bold"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                    Processing...
                  </span>
                ) : (
                  "Update Passcode"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Card className="bg-white border-slate-200 shadow-sm w-full">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <MapPin className="w-4 h-4 text-indigo-600" />
              Saved Shipping Address Profiles
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Manage your verified home delivery locations vectors for fast
              checkout clearance
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs shadow-none h-8 px-3"
          >
            Add Delivery Profile
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-xs font-medium text-slate-400">
              No delivery shipping profiles registered inside this account
              directory index.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="border border-slate-200 rounded-xl p-4 bg-white flex items-start justify-between shadow-none hover:border-slate-300 transition-colors group"
                >
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <MapPin className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="space-y-0.5 text-xs text-slate-600">
                      <div className="font-bold text-sm text-slate-900 capitalize">
                        {addr.street || "Address Street"}
                      </div>
                      <div>
                        {addr.city || ""}, {addr.state || ""}{" "}
                        {addr.zipCode || ""}
                      </div>
                      <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-1">
                        {addr.country || "NIGERIA"}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-lg shadow-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
