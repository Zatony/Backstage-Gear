import { useEffect, useState, useRef } from "react";
import profile from "./profile.module.css";
import { getAuthToken } from "../util/auth";
import { useNavigate } from "react-router-dom";
import PasswordChange from "../components/passwordChange";
import FormInput from "../components/formInput";

function ProfileField({ label, value, isReadOnly = true, refInput, type = "text" }) {
  return (
    <div className={profile.profileField}>
      <span className={profile.profileFieldLabel}>{label}</span>
      <input
        className={profile.profileFieldInput}
        defaultValue={value}
        readOnly={isReadOnly}
        ref={refInput}
        type={type}
      />
    </div>
  );
}

function formatHungarianPhone(input) {
  if (!input) return "";
  let digits = String(input).replace(/\D/g, "");

  if (digits.startsWith("36")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("06")) {
    digits = digits.slice(2);
  }

  if (digits.length !== 9) {
    return input;
  }

  const area = digits.slice(0, 2);
  const part1 = digits.slice(2, 5);
  const part2 = digits.slice(5);

  return `+36 ${area} ${part1} ${part2}`;
}

function unformatHungarianPhone(input) {
  if (input == null) return null;
  const digits = String(input).replace(/\D/g, "");
  if (digits.length === 9) {
    return `36${digits}`;
  }
  if (digits.length === 11) {
    if (digits.startsWith("36")) return digits;
    if (digits.startsWith("06")) return `36${digits.slice(2)}`;
  }
  if (digits.startsWith("36") && digits.length > 11) return digits.slice(0, 11);
  return null;
}

export default function Profile() {
  const token = getAuthToken();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    pictureLink: "",
    up_vote: 0,
    down_vote: 0
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const username = useRef(null);
  const phoneNumber = useRef(null);
  const image = useRef(null);

  useEffect(() => {
    async function fetchUser() {
      if (!token) return;
      try {
        const response = await fetch("http://localhost:3000/backstagegear/me/my_profile", {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });

        const resData = await response.json();
        if (response.ok) {
          setUserData({
            username: resData.username,
            phone: resData.phone_number,
            pictureLink: resData.profile_picture,
            up_vote: resData.up_votes,
            down_vote: resData.down_votes
          });
        }
      } catch (err) {
        console.error("Hiba történt a felhasználói adatok lekérése során: ", err);
      }
    }
    fetchUser();
  }, [token]);

  async function handleDeleteProfile() {
    if (!window.confirm("Biztosan törölni szeretnéd a profilodat? Ez a művelet nem visszavonható!")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/backstagegear/me/my_profile/delete_my_profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        }
      });

      if (response.ok) {
        alert("Profil sikeresen törölve!");
        localStorage.removeItem("token");
        localStorage.removeItem("is_admin");
        localStorage.removeItem("expiration");
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
      } else {
        const errorText = await response.text();
        alert("Hiba történt a törlés során: " + errorText);
      }
    } catch (err) {
      console.error("Hiba történt a profil törlése során: ", err);
      alert("Hiba történt a profil törlése során.");
    }
  }

  async function handleUpdateProfile() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (username.current && username.current.value !== userData.username) {
        formData.append("username", username.current.value);
      }

      if (phoneNumber.current) {
        const unformattedPhone = unformatHungarianPhone(phoneNumber.current.value);
        if (unformattedPhone && unformattedPhone !== userData.phone) {
          formData.append("phone_number", unformattedPhone);
        }
      }

      if (image.current && image.current.files && image.current.files[0]) {
        formData.append("file", image.current.files[0]);
      }

      const response = await fetch("http://localhost:3000/backstagegear/me/my_profile/update_datas", {
        method: "PATCH",
        headers: {
          "x-access-token": token
        },
        body: formData
      });

      if (response.ok) {
        alert("Profil sikeresen frissítve!");
        setIsEditing(false);
        window.location.reload();
      } else {
        const errorText = await response.text();
        alert("Hiba történt a frissítés során: " + errorText);
      }
    } catch (err) {
      console.error("Hiba történt a profil frissítése során: ", err);
      alert("Hiba történt a profil frissítése során.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    if (username.current) username.current.value = userData.username;
    if (phoneNumber.current) phoneNumber.current.value = formatHungarianPhone(userData.phone);
  }

  return (
    <div>
      <div className={profile.profileTextContainer}>
        <h1 className={profile.profileTitle}>Profil szerkesztése</h1>
        <div className={profile.profileLine}></div>
      </div>

      <div className={profile.profileContainer}>
        <div className={profile.profileMain}>
          <div className={profile.profilePicture}>
            <img src={userData.pictureLink} alt="Profilkép" className={profile.profileImg} />
          </div>

          <div className={profile.profileFields}>
            <ProfileField label="Felhasználónév:" value={userData.username} isReadOnly={!isEditing} refInput={username} />
            <ProfileField label="Telefonszám:" value={formatHungarianPhone(userData.phone)} isReadOnly={!isEditing} refInput={phoneNumber} />
            <FormInput page={profile} label="Kép feltöltése" type="file" accept="image/*" refInput={image} disabled={!isEditing} />
          </div>
        </div>

        <div className={profile.profileButtons}>
          <button
            className={profile.deleteButton}
            onClick={handleDeleteProfile}
            disabled={isSubmitting}
          >
            Profil törlése
          </button>
          <button
            className={profile.changePasswordButton}
            onClick={() => setShowPasswordChange(true)}
            disabled={isSubmitting}
          >
            Jelszó módosítása
          </button>
          {isEditing ? (
            <>
              <button
                className={profile.cancelButton}
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Mégse
              </button>
              <button
                className={profile.changeDataButton}
                onClick={handleUpdateProfile}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mentés..." : "Mentés"}
              </button>
            </>
          ) : (
            <button
              className={profile.changeDataButton}
              onClick={handleUpdateProfile}
            >
              Adatok módosítása
            </button>
          )}
        </div>
      </div>
      {showPasswordChange && <PasswordChange onClose={() => setShowPasswordChange(false)} />}
    </div>
  );
}