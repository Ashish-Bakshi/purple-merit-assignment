import { useState } from "react";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import Toast from "../components/ui/Toast";
import GoBack from "../components/ui/GoBack";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  function showToast(message: string, type: "success" | "error" | "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function updateProfile() {
    if (!fullName || !email) {
      showToast("Full name and email are required", "error");
      return;
    }

    try {
      setLoadingProfile(true);
      await api.put("/users/me", { fullName, email });
      showToast("Profile updated successfully", "success");
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setLoadingProfile(false);
    }
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) {
      showToast("Both password fields are required", "error");
      return;
    }

    try {
      setLoadingPassword(true);
      await api.put("/users/me/password", {
        currentPassword,
        newPassword,
      });
      showToast("Password changed successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      showToast("Failed to change password", "error");
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
        <GoBack />
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Profile
        </h2>

        {/* Update Profile */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Update Profile</h3>

          <Input
            label="Full Name"
            placeholder="Your name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <button
            onClick={updateProfile}
            disabled={loadingProfile}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loadingProfile ? <Spinner /> : "Update Profile"}
          </button>
        </div>

        <hr className="my-6" />

        {/* Change Password */}
        <div>
          <h3 className="text-lg font-medium mb-4">Change Password</h3>

          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />

          <button
            onClick={changePassword}
            disabled={loadingPassword}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-60"
          >
            {loadingPassword ? <Spinner /> : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
