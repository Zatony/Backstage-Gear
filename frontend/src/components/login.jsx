import { useRef, useState } from "react";

export default function Login({ onClose, onShowRegister }) {
  const refEmail = useRef(null);
  const refPassword = useRef(null);

  const [isValided, setIsValid] = useState({
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

    if(isEdited.email && isValided.email && isEdited.password && isValided.password){
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
        sessionStorage.setItem('token', data.token);
        
        console.log("token: " + data.token);
        console.log("Sikeres belépés!");
        onClose();

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
          <div className="log_reg-row">
            <div className="row">
              <div className="col-6">
                <label htmlFor="email">E-mail cím:</label>
              </div>
              <div className="col-6 text-end">
                {isEdited.email && !isValided.email && (<span className="input-error" >Kérlek töltsd ki a mezőt!</span>)}
              </div>
            </div>
            <input type="email" id="email" name="email" autoComplete="email" ref={refEmail} onBlur={() => validateInputs(refEmail.current.value, "email")} onChange={() => validateInputs(refEmail.current.value, "email")}/>
          </div>
          <div className="log_reg-row">
            <div className="row">
              <div className="col-6">
                <label htmlFor="password">Jelszó:</label>
              </div>
              <div className="col-6 text-end">
                {isEdited.password && !isValided.password && (<span className="input-error">Kérlek töltsd ki a mezőt!</span>)}
              </div>
            </div>
            <input type="password" id="password" name="password" ref={refPassword} onBlur={() => validateInputs(refPassword.current.value, "password")} onChange={() => validateInputs(refPassword.current.value, "password")} />
            <p htmlFor="forgot-password" className="forgot-psw">Elfelejtetted a jelszavad?</p>
          </div>
          <div className="log_reg-actions">
            <button className="login-button">Belépés</button>
            <button type="button" className="register-button" onClick={handleSwitchToRegister}>Regisztráció</button>
          </div>
        </form>
      </div>
    </div>
  );
}