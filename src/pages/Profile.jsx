
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe } from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getMe();
      const profile = data.user || data;

      setUser(profile);
      setPhone(profile.phone || "");
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePhone = async () => {
    setPhoneMessage("");

    if (!phone.trim()) {
      setPhoneMessage("Please enter a WhatsApp number.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setPhoneMessage("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    try {
      setSavingPhone(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8001/api/profile/phone?phone=${encodeURIComponent(
          cleanPhone
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update phone number.");
      }

      setPhone(cleanPhone);
      setUser((prev) => ({
        ...prev,
        phone: cleanPhone,
      }));

      setPhoneMessage("WhatsApp number saved successfully.");
    } catch (error) {
      console.error("Phone update failed:", error);
      setPhoneMessage(error.message || "Failed to update phone number.");
    } finally {
      setSavingPhone(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <h2>Unable to load profile</h2>
          <p>Please log in again.</p>

          <Link to="/login" className="profile-btn">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const name = user.name || "Patient";
  const email = user.email || "Not available";
  const role = user.role || "patient";

  return (
    <div className="profile-page">

      <div className="profile-header">
        <div>
          <p className="profile-label">DIAIRIS</p>

          <h1>My Profile</h1>

          <p>
            Manage your account information and access
            your DIAIRIS services.
          </p>
        </div>
      </div>

      <div className="profile-layout">

        {/* Profile Card */}
        <div className="profile-card profile-main-card">

          <div className="profile-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <h2>{name}</h2>

          <p className="profile-email">
            {email}
          </p>

          <span className="profile-role">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>

        </div>

        {/* Account Information */}
        <div className="profile-card">

          <h2>Account Information</h2>

          <div className="profile-info">

            <div className="profile-info-item">
              <span>Full Name</span>
              <strong>{name}</strong>
            </div>

            <div className="profile-info-item">
              <span>Email Address</span>
              <strong>{email}</strong>
            </div>

            <div className="profile-info-item">
              <span>Account Type</span>

              <strong>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </strong>
            </div>

          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="profile-card">

          <h2>WhatsApp Notifications</h2>

          <p className="profile-phone-description">
            Add your WhatsApp number to receive appointment
            confirmation messages from DIAIRIS.
          </p>

          <div className="profile-phone-form">

            <label htmlFor="phone">
              WhatsApp Number
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit number"
              maxLength="10"
            />

            <button
              type="button"
              className="profile-btn"
              onClick={savePhone}
              disabled={savingPhone}
            >
              {savingPhone ? "Saving..." : "Save Phone Number"}
            </button>

            {phoneMessage && (
              <p className="profile-phone-message">
                {phoneMessage}
              </p>
            )}

          </div>
        </div>

        {/* Quick Access */}
        <div className="profile-card">

          <h2>Quick Access</h2>

          <div className="profile-actions">

            <Link to="/detection">
              <span>AI Screening</span>
              <small>Analyze a retinal image →</small>
            </Link>

            <Link to="/history">
              <span>Screening History</span>
              <small>View previous screening results →</small>
            </Link>

            <Link to="/appointments">
              <span>Appointments</span>
              <small>Manage your appointments →</small>
            </Link>

          </div>
        </div>

        {/* Safety Information */}
        <div className="profile-card profile-safety">

          <h2>About DIAIRIS</h2>

          <p>
            DIAIRIS is an AI-assisted diabetic retinopathy
            screening system designed to help users identify
            potential retinal abnormalities.
          </p>

          <p>
            Screening results are intended to support,
            not replace, professional medical evaluation.
          </p>

        </div>

      </div>
    </div>
  );
}

export default Profile
