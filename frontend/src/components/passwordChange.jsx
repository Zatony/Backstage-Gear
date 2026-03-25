import { useRef, useState, useEffect } from "react";
import InputField from "./inputField";
import { getAuthToken } from "../util/auth";

export default function PasswordChange({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const refCurrentPassword = useRef(null);
  const refNewPassword = useRef(null);
  const refNewPasswordRepeat = useRef(null);

  const [isValid, setIsValid] = useState({
    currentPassword: false,
    newPassword: false,
    newPasswordRepeat: false,
  });

  const [isEdited, setIsEdited] = useState({
    currentPassword: false,
    newPassword: false,
    newPasswordRepeat: false,
  });

  function validateInputs(inputText, inputType) {
    if (inputText.trim().length === 0) {
      setIsValid((prevState) => ({ ...prevState, [inputType]: false }));
    } else {
      setIsValid((prevState) => ({ ...prevState, [inputType]: true }));
    }
    setIsEdited((prevState) => ({ ...prevState, [inputType]: true }));
  }

  async function handlePasswordChange(e) {
    e.preventDefault();


    if (!isEdited.currentPassword || !isValid.currentPassword ||
        !isEdited.newPassword || !isValid.newPassword ||
        !isEdited.newPasswordRepeat || !isValid.newPasswordRepeat) {
      alert("Töltsd ki az összes mezőt!");
      return;
    }

    if (refNewPassword.current.value !== refNewPasswordRepeat.current.value) {
      alert("Az új jelszavak nem egyeznek!");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("Nincs bejelentkezve!");
      return;
    }

    const passwordData = {
      //currentPassword: refCurrentPassword.current.value,
      password: refNewPassword.current.value,
    };

    // console.log("Jelszó módosítás adatai:", passwordData);

    try {
      const response = await fetch("http://localhost:3000/backstagegear/me/my_profile/update_password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        alert("Hibás jelenlegi jelszó!");
        return;
      }

      alert("Jelszó sikeresen módosítva!");
      onClose();
    } catch (err) {
      console.error("Hiba történt a jelszó módosítása során: ", err);
    }
  }

  return (
    <div className="log_reg-overlay" onClick={onClose}>
      <div className="log_reg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log_reg-header">
          <h2>Jelszó módosítása</h2>
          <div className="loginLine"></div>
          <button className="log_reg-close" onClick={onClose} aria-label="Bezárás">x</button>
        </div>

        <form className="login-form" onSubmit={handlePasswordChange}>
          <InputField type="password" name="currentPassword" labelText="Jelenlegi jelszó" refData={refCurrentPassword} isValid={isValid} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="password" name="newPassword" labelText="Új jelszó" refData={refNewPassword} isValid={isValid} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="password" name="newPasswordRepeat" labelText="Új jelszó újra" refData={refNewPasswordRepeat} isValid={isValid} isEdited={isEdited} validateInputs={validateInputs}/>
          <div className="log_reg-actions">
            <button className="login-button">Módosítás</button>
          </div>
        </form>

      </div>
    </div>
  );
}
