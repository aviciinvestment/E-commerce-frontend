import { useState } from "react";
import {
  updateAccountProfileAPI,
  changeAccountPasswordAPI,
  deleteUserAddressAPI,
} from "../services/profileService";
import { toast } from "sonner";

export const useProfileController = (initialUser, onRefreshData) => {
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Form states initialized safely from current user profile values
  const [fullname, setFullname] = useState(initialUser?.fullname || "");
  const [email, setEmail] = useState(initialUser?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update Personal Profile (Name & Email)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullname || !email) return;

    setProfileLoading(true);
    try {
      const res = await updateAccountProfileAPI(fullname.trim(), email.trim());
      toast.success(res.message || "Profile parameters updated cleanly!");
      if (onRefreshData) onRefreshData(); // Re-trigger main dashboard data pull
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save profile changes.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Change Password Security configuration
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match. Please re-enter.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changeAccountPasswordAPI(currentPassword, newPassword);
      toast.success(
        res.message || "Password credentials updated successfully!",
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Password adjustment rejected.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete Delivery Profile Address
  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteUserAddressAPI(addressId);
      toast.success("Shipping address purged from profile directory.");
      if (onRefreshData) onRefreshData();
    } catch (err) {
      toast.error(`Failed to remove address${err}`);
    }
  };

  return {
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
  };
};
