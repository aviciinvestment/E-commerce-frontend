import { useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import {
  fetchUserProfileAPI,
  updateAccountProfileAPI,
  changeAccountPasswordAPI,
  fetchUserAddressesAPI,
  addUserAddressAPI,
  updateUserAddressAPI,
  deleteUserAddressAPI,
} from "../services/userService";
import { toast } from "sonner";

export const useProfileController = () => {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState(null);

  // Guard reference tracks network execution cycles to kill rendering loops completely
  const hasExecutedRef = useRef(false);

  // Overlay form tracking states
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Profile forms fields binding variables
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Address inputs parameters tracking state map
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("Nigeria");

  const getAuthenticatedUserId = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const syncAccountDataMatrix = async () => {
    const userId = getAuthenticatedUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [addrData, profileData] = await Promise.all([
        fetchUserAddressesAPI(userId),
        fetchUserProfileAPI(),
      ]);

      setAddresses(addrData.data || addrData || []);

      if (profileData.success) {
        const user = profileData.data;
        setProfile({
          fullname: user.fullname || "",
          email: user.email || "",
          createdAt: user.createdAt,
        });
        setFullname(user.fullname || "");
        setEmail(user.email || "");
      }
    } catch (err) {
      console.error("Account synchronization failure:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateAccountProfileAPI(fullname.trim(), email.trim());
      toast.success(res.message || "Identity credentials updated.");
      await syncAccountDataMatrix();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await changeAccountPasswordAPI(currentPassword, newPassword);
      toast.success(res.message || "Passcode modified successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Passcode change rejected.");
    } finally {
      setLoading(false);
    }
  };

  const openAddressFormModal = (addr = null) => {
    if (addr) {
      setEditingAddressId(addr._id);
      setStreet(addr.street || "");
      setCity(addr.city || "");
      setState(addr.state || "");
      setZipCode(addr.zipCode || "");
      setCountry(addr.country || "Nigeria");
    } else {
      setEditingAddressId(null);
      setStreet("");
      setCity("");
      setState("");
      setZipCode("");
      setCountry("Nigeria");
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddressSubmit = async (e) => {
    e.preventDefault();
    const userId = getAuthenticatedUserId();
    const payload = { userId, street, city, state, zipCode, country };

    setLoading(true);
    try {
      if (editingAddressId) {
        await updateUserAddressAPI({ addressId: editingAddressId, ...payload });
        toast.success("Shipping profile details updated.");
      } else {
        await addUserAddressAPI(payload);
        toast.success("New shipping destination pinned.");
      }
      setAddressModalOpen(false);
      await syncAccountDataMatrix();
    } catch (err) {
      console.log(err);
      toast.error("Error writing address data parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddressTrigger = async (id) => {
    try {
      await deleteUserAddressAPI(id);
      toast.success("Address erased completely.");
      await syncAccountDataMatrix();
    } catch (err) {
      console.log(err);
      toast.error("Deletion query rejected.");
    }
  };

  return {
    loading,
    addresses,
    profile,
    syncAccountDataMatrix,
    hasExecutedRef,
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
  };
};
