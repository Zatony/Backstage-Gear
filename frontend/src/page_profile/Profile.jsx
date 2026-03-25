import { useEffect, useState, useRef } from "react";
import profile from "./profile.module.css";
import { getAuthToken } from "../util/auth";
import { formatHungarianPhone, unformatHungarianPhone, createPhoneChangeHandler } from "../util/phoneUtils";
import { useNavigate } from "react-router-dom";
import PasswordChange from "../components/passwordChange";
import InputField from "../components/inputField";

export default function Profile() {
  const token = getAuthToken();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    pictureLink: null,
    up_vote: 0,
    down_vote: 0
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState({
    username: true,
    phone: true
  });
  const [isEdited, setIsEdited] = useState({
    username: false,
    phone: false
  });

  const username = useRef(null);
  const phoneNumber = useRef(null);
  const image = useRef("#");

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
      setIsEdited({
        username: false,
        phone: false
      });
      setIsValid({
        username: true,
        phone: true
      });
      return;
    }

    if ((isEdited.username && !isValid.username) || (isEdited.phone && !isValid.phone)) {
      alert("Kérlek töltsd ki a mezőket helyesen!");
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
        setIsEdited({
          username: false,
          phone: false
        });
        setIsValid({
          username: true,
          phone: true
        });
        setIsEditing(false);

        setUserData((prev) => ({
          ...prev,
          username: username.current?.value || prev.username,
          phone: unformatHungarianPhone(phoneNumber.current?.value || "") || prev.phone,
        }));
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

  function validateInputs(inputText, inputType) {
    if (inputText.trim().length === 0) {
      setIsValid((prevState) => ({ ...prevState, [inputType]: false }));
    } else {
      setIsValid((prevState) => ({ ...prevState, [inputType]: true }));
    }
    setIsEdited((prevState) => ({ ...prevState, [inputType]: true }));
  }

  const handlePhoneChange = createPhoneChangeHandler(phoneNumber, validateInputs, 'phone');

  function handleCancelEdit() {
    setIsEditing(false);
    if (username.current) username.current.value = userData.username;
    if (phoneNumber.current) phoneNumber.current.value = formatHungarianPhone(userData.phone);
    setIsEdited({
      username: false,
      phone: false
    });
    setIsValid({
      username: true,
      phone: true
    });
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
            <img src={userData.pictureLink || undefined} alt="Profilkép" className={profile.profileImg} />
          </div>

          <div className={profile.profileFields}>
            <InputField page={profile} label="Felhasználónév" defaultValue={userData.username} readOnly={!isEditing} refInput={username} isValid={isValid.username} isEdited={isEdited.username} validateInputs={validateInputs} fieldName="username" wrapperClassName={profile.profileField} inputClassName={profile.profileFieldInput} />
            <InputField page={profile} label="Telefonszám" defaultValue={formatHungarianPhone(userData.phone)} readOnly={!isEditing} refInput={phoneNumber} onChange={isEditing ? handlePhoneChange : undefined} isValid={isValid.phone} isEdited={isEdited.phone} validateInputs={validateInputs} fieldName="phone" wrapperClassName={profile.profileField} inputClassName={profile.profileFieldInput} />
            <InputField page={profile} label="Kép feltöltése" type="file" accept="image/*" refInput={image} disabled={!isEditing} />
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