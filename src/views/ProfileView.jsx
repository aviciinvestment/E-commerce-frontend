import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, KeyRound, MapPin, Trash2, Edit3, Plus } from "lucide-react";

export const ProfileSettings = ({
  loading,
  addresses,
  fullname,
  setFullname,
  email,
  setEmail,
  handleUpdateInfoSubmit,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleChangePasswordSubmit,
  street,
  setStreet,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
  country,
  setCountry,
  addressModalOpen,
  setAddressModalOpen,
  editingAddressId,
  openAddressFormModal,
  handleSaveAddressSubmit,
  handleDeleteAddressTrigger,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-900">
              <User className="w-4 h-4 text-indigo-600" /> Identity Credentials
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Modify your primary display username name string and email
              registry lines
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateInfoSubmit}>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">
                  Account Fullname
                </label>
                <Input
                  type="text"
                  className="h-10 text-xs shadow-none border-slate-200 focus-visible:ring-indigo-500"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">
                  Email Address Registry
                </label>
                <Input
                  type="email"
                  className="h-10 text-xs shadow-none border-slate-200 focus-visible:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-3 flex">
              <Button
                type="submit"
                size="sm"
                className="ml-auto bg-slate-900 hover:bg-slate-800 text-xs font-bold px-4 h-8 shadow-none rounded-lg"
                disabled={loading}
              >
                Save Profile Changes
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-900">
              <KeyRound className="w-4 h-4 text-indigo-600" /> Security
              Authorization
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Establish a fresh cryptographed passcode encryption password match
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleChangePasswordSubmit}>
            <CardContent className="space-y-3 pt-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-9 text-xs shadow-none focus-visible:ring-indigo-500"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-9 text-xs shadow-none focus-visible:ring-indigo-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-9 text-xs shadow-none focus-visible:ring-indigo-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-3 flex">
              <Button
                type="submit"
                size="sm"
                className="ml-auto bg-slate-900 hover:bg-slate-800 text-xs font-bold px-4 h-8 shadow-none rounded-lg"
                disabled={loading}
              >
                Update Passcode
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* SAVED SHIPPING LOCATION CARDS ROW */}
      <Card className="bg-white border-slate-200 shadow-sm w-full rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 p-5">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-900">
              <MapPin className="w-4 h-4 text-indigo-600" /> Shipping Locations
              Registry
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Configure address sub-document profiles matching database schemas
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => openAddressFormModal(null)}
            className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs shadow-none h-8 px-3 gap-1.5 rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Address
          </Button>
        </CardHeader>
        <CardContent className="p-5">
          {addresses.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-slate-400">
              No delivery address records found inside this user account
              directory. Click button above to pin an entry.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="border border-slate-200 rounded-xl p-4 bg-white flex items-start justify-between shadow-none hover:border-slate-300 transition-all group"
                >
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 text-xs text-slate-600">
                      <div className="font-bold text-sm text-slate-900 capitalize">
                        {addr.street}
                      </div>
                      <div>
                        {addr.city}, {addr.state} {addr.zipCode}
                      </div>
                      <div className="text-[10px] font-bold text-indigo-500 uppercase mt-1 tracking-wider">
                        {addr.country}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => openAddressFormModal(addr)}
                      className="h-7 w-7 text-slate-500 hover:text-slate-900 rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAddressTrigger(addr._id)}
                      className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* OVERLAY DIALOG DRAW OVERLAY MODAL */}
      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="sm:max-w-105 bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900">
              {editingAddressId
                ? "Modify Saved Delivery Profile"
                : "Pin New Delivery Destination"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Fill in parameters matching your address sub-document schema
              requirements
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveAddressSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">
                Street Address
              </label>
              <Input
                type="text"
                placeholder="e.g. 123 Main Street"
                className="h-9 text-xs focus-visible:ring-indigo-500"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">City</label>
                <Input
                  type="text"
                  placeholder="Abuja"
                  className="h-9 text-xs focus-visible:ring-indigo-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  State / Region
                </label>
                <Input
                  type="text"
                  placeholder="FCT"
                  className="h-9 text-xs focus-visible:ring-indigo-500"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  Postal / Zip Code
                </label>
                <Input
                  type="text"
                  placeholder="900108"
                  className="h-9 text-xs focus-visible:ring-indigo-500"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  Country
                </label>
                <Input
                  type="text"
                  className="h-9 text-xs focus-visible:ring-indigo-500"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs h-9 rounded-xl shadow-none"
                disabled={loading}
              >
                {loading
                  ? "Synchronizing database cluster..."
                  : "Commit Shipping Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
