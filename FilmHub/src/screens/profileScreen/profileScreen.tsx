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

const Profile: React.FC = () => {
  const { state, updateProfile, changePassword, fetchCurrentUser } = useAuthContext() as any;
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
                  <button className="btn" type="button" onClick={() => setEditMode(true)}>Change data</button>
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
                  <label>
                    Email
                    <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" />
                  </label>
                  <div className="profile-actions">
                    <button className="btn" type="button" onClick={() => { setEditMode(false); setForm({ firstName: user.firstName||"", lastName: user.lastName||"", age: user.age??"", email: user.email||"" }); }}>Cancel</button>
                    <button className="btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
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
                  <input name="currentPassword" type="password" value={pwd.currentPassword} onChange={onChangePwd} placeholder="Current password" />
                </label>
                <label>
                  New password
                  <input name="newPassword" type="password" value={pwd.newPassword} onChange={onChangePwd} placeholder="New password" />
                </label>
                <label>
                  Confirm new password
                  <input name="confirmNewPassword" type="password" value={pwd.confirmNewPassword} onChange={onChangePwd} placeholder="Confirm new password" />
                </label>
                <button className="btn" type="submit">Change password</button>
              </form>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default Profile;
