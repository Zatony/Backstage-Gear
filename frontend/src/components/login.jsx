import { useRef, useState, useEffect } from "react";
import InputField from "./inputField";

export default function Login({ onClose, onShowRegister }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  const refEmail = useRef(null);
  const refPassword = useRef(null);

  const [isValid, setIsValid] = useState({
    email: false,
    password: false,
  });

  const [isEdited, setIsEdited] = useState({
    email: false,
    password: false,
  });

  function validateInputs(inputText, inputType) {
    if (inputText.trim().length == 0)
      setIsValid((prevState) => ({ ...prevState, [inputType]: false }));
    else
      setIsValid((prevState) => ({ ...prevState, [inputType]: true }));

    setIsEdited((prevState) => ({ ...prevState, [inputType]: true }));
  }

  async function handleLogin(e) {
    e.preventDefault();

    //console.log(refEmail.current.value + " - " + refPassword.current.value);

    if(isEdited.email && isValid.email && isEdited.password && isValid.password){
      const userData = {
        email: refEmail.current.value,
        password: refPassword.current.value,
      }

      //console.log(userData)
      try{
        const response = await fetch("http://localhost:3000/backstagegear/login", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(userData)
        });
        if(!response.ok){
          alert("Hibás e-mail cím vagy jelszó!");
          return;
        }
        //console.log(response);
        const data = await response.json();
        localStorage.setItem('token', data.token);

        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 2);
        localStorage.setItem('expiration', expiration.toISOString());

        // console.log("token: " + data.token);
        // console.log("Sikeres belépés!");
        onClose();
        try{ window.dispatchEvent(new Event('authChanged')); }catch(e){}

      } catch(err){
        console.error("Hiba történt a belépés során: ", err);
      }
    }
    else{
      alert("Töltsd ki az összes mezőt!");
    }
  }

  function handleSwitchToRegister() {
    onShowRegister();
    onClose();
  }

  return (
    <div className="log_reg-overlay" onClick={onClose}>
      <div className="log_reg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log_reg-header">
          <h2>Belépés</h2>
          <div className="loginLine"></div>
          <button className="log_reg-close" onClick={onClose} aria-label="Bezárás">x</button>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <InputField type="email" name="email" labelText="E-mail cím" refData={refEmail} isValid={isValid} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="password" name="password" labelText="Jelszó" refData={refPassword} isValid={isValid} isEdited={isEdited} validateInputs={validateInputs}/>
          <p htmlFor="forgot-password" className="forgot-psw">Elfelejtetted a jelszavad?</p>
          <div className="log_reg-actions">
            <button className="login-button">Belépés</button>
            <button type="button" className="register-button" onClick={handleSwitchToRegister}>Regisztráció</button>
          </div>
        </form>

      </div>
    </div>
  );
}