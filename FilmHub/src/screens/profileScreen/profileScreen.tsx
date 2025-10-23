import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaLock,
  FaCrown,
  FaLaptop,
  FaUsers,
} from "react-icons/fa";
import "./profileScreen.css";
import WavesBackground from "../../components/waves/waves";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../API/authContext";
import Swal from "sweetalert2";
import PasswordInput from "../../components/PasswordInput/PasswordInput";

const Profile: React.FC = () => {
  const { state, updateProfile, changePassword, fetchCurrentUser, deleteAccount } = useAuthContext() as any;
  const navigate = useNavigate();
  const user = state?.user || {};
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age ?? "",
    email: user.email || "",
  });
  const [editMode, setEditMode] = useState(false);
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [saving, setSaving] = useState(false);
  const [deletePwd, setDeletePwd] = useState("");
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "age" ? value.replace(/[^0-9]/g, "") : value }));
  };
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      icon: "question",
      title: "Save changes?",
      text: "Do you want to update your profile information?",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    setSaving(true);
    try {
      const payload: any = {
        firstName: form.firstName?.trim(),
        lastName: form.lastName?.trim(),
        email: form.email?.trim(),
      };
      if (form.age !== "" && form.age !== null && form.age !== undefined) {
        payload.age = Number(form.age);
      }
      await updateProfile(payload);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };
  const onChangePwd: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setPwd((p) => ({ ...p, [name]: value }));
  };
  const onSubmitPwd: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // Validaciones básicas del lado del cliente
    if (!pwd.currentPassword || !pwd.newPassword || !pwd.confirmNewPassword) {
      await Swal.fire({ icon: "warning", title: "Missing fields", text: "Please fill out all password fields." });
      return;
    }
    if (pwd.newPassword.length < 8) {
      await Swal.fire({ icon: "warning", title: "Weak password", text: "New password must be at least 8 characters." });
      return;
    }
    if (pwd.newPassword !== pwd.confirmNewPassword) {
      await Swal.fire({ icon: "warning", title: "Passwords do not match", text: "Confirm that both new passwords match." });
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Change password?",
      text: "Are you sure you want to update your password?",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    await changePassword(pwd);
    setPwd({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  };
  
  useEffect(() => {
    (async () => {
      const loaded = await fetchCurrentUser?.();
      const u: any = loaded || user;
      setForm({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        age: u.age ?? "",
        email: u.email || "",
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fullName = `${(user.firstName || "").trim()} ${(user.lastName || "").trim()}`.trim() || user.email || "";
  return (
    <div className="profile-wrapper">
      <WavesBackground />
      <div className="profile-container">
        <div className="profile-topbar">
          <button className="btn btn-back" onClick={() => navigate(-1)} aria-label="Go back">
            ← Back
          </button>
        </div>
        <h2 className="profile-title">My Profile</h2>
        <p className="profile-subtitle">{fullName}</p>

        <div className="profile-sections">
          {/* === Account (editable) === */}
          <div className="profile-card">
            <div className="profile-card-header">
              <FaUser className="profile-icon" />
              <h3>Account</h3>
            </div>
            <div className="profile-card-content">
              {!editMode ? (
                <div className="profile-readonly">
                  <p><strong>Name:</strong> {user.firstName} {user.lastName || ""}</p>
                  <p><strong>Age:</strong> {user.age ?? "-"}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <button className="btn" type="button" onClick={() => setEditMode(true)}>Change Data</button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="profile-form">
                  <label>
                    First name
                    <input name="firstName" value={form.firstName} onChange={onChange} placeholder="First name" />
                  </label>
                  <label>
                    Last name
                    <input name="lastName" value={form.lastName} onChange={onChange} placeholder="Last name" />
                  </label>
                  <label>
                    Age
                    <input name="age" value={String(form.age ?? "")} onChange={onChange} placeholder="Age" inputMode="numeric" />
                  </label>
                  <label className="col-span-2">
                    Email
                    <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" />
                  </label>
                  <div className="profile-actions">
                    <button className="btn" type="button" onClick={() => { setEditMode(false); setForm({ firstName: user.firstName||"", lastName: user.lastName||"", age: user.age??"", email: user.email||"" }); }}>Cancel</button>
                    <button className="btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* === Security (placeholder) === */}
          <div className="profile-card">
            <div className="profile-card-header">
              <FaLock className="profile-icon" />
              <h3>Security</h3>
            </div>
            <div className="profile-card-content">
              <form onSubmit={onSubmitPwd} className="profile-form single">
                <label>
                  Current password
                  <PasswordInput name="currentPassword" value={pwd.currentPassword} onChange={onChangePwd} placeholder="" autoComplete="current-password" />
                </label>
                <label>
                  New password
                  <PasswordInput name="newPassword" value={pwd.newPassword} onChange={onChangePwd} placeholder="" autoComplete="new-password" />
                </label>
                <label>
                  Confirm new password
                  <PasswordInput name="confirmNewPassword" value={pwd.confirmNewPassword} onChange={onChangePwd} placeholder="" autoComplete="new-password" />
                </label>
                <button className="btn" type="submit">Change Password</button>
              </form>
            </div>
          </div>

          {/* === Danger Zone: Delete Account === */}
          <div className="profile-card">
            <div className="profile-card-header">
              <FaLock className="profile-icon" />
              <h3>Danger zone</h3>
            </div>
            <div className="profile-card-content">
              <form
                className="profile-form single"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!deletePwd) {
                    await Swal.fire({ icon: "warning", title: "Password required", text: "Please confirm your password to delete the account." });
                    return;
                  }
                  const result = await Swal.fire({
                    icon: "warning",
                    title: "Delete account?",
                    text: "This action is irreversible. All your data will be removed.",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete",
                    cancelButtonText: "Cancel",
                  });
                  if (!result.isConfirmed) return;
                  const ok = await deleteAccount(deletePwd);
                  if (!ok) return;
                  setDeletePwd("");
                }}
              >
                <label>
                  Confirm your password
                  <PasswordInput
                    name="deletePassword"
                    value={deletePwd}
                    onChange={(e: any) => setDeletePwd(e.target.value)}
                    autoComplete="current-password"
                  />
                </label>
                <button className="btn btn-danger" type="submit">Delete Account</button>
              </form>
            </div>
          </div>
        
        
        </div>
      </div>
    </div>
  );
};

export default Profile;
