import { useRef, useState, useEffect } from "react";
import InputField from "./inputField";

export default function Registration({ onClose, onRegister }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  const refName = useRef(null);
  const refUsername = useRef(null);
  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refRePassword = useRef(null);
  const refPhone = useRef(null);
  const refBirthdate = useRef(null);

  const [isValided, setIsValid] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
    repassword: false,
    tel: false,
    date: false,
  });

  const [isEdited, setIsEdited] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
    repassword: false,
    tel: false,
    date: false,
  });

  function validateInputs(inputText, inputType) {
    if (inputText.trim().length == 0)
      setIsValid((prevState) => ({ ...prevState, [inputType]: false }));
    else
      setIsValid((prevState) => ({ ...prevState, [inputType]: true }));

    setIsEdited((prevState) => ({ ...prevState, [inputType]: true }));
  }

  async function handleRegistration(e) {
    e.preventDefault();
    
    if(isEdited.name && isValided.name &&
       isEdited.username && isValided.username &&
       isEdited.email && isValided.email &&
       isEdited.password && isValided.password &&
       isEdited.repassword && isValided.repassword &&
       isEdited.tel && isValided.tel &&
       isEdited.date && isValided.date){

      if(refPassword.current.value !== refRePassword.current.value){
        alert("A jelszavak nem egyeznek!");
        refRePassword.current.focus();
        return;
      }

      const newUser = {
        name: refName.current.value,
        userName: refUsername.current.value,
        email: refEmail.current.value,
        password: refPassword.current.value,
        phoneNumber: refPhone.current.value,
        dateOfBirth: refBirthdate.current.value
      }

      console.log(newUser);

      try{
        const response = await fetch("http://localhost:3000/backstagegear/signup", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(newUser)
        });        
        if(!response.ok){
          alert("Sikertelen regisztráció!");
          return;
        }
        console.log(response)

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('is_admin', data.is_admin || 0);

        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 2);
        localStorage.setItem('expiration', expiration.toISOString());
        
        console.log("token: " + data.token);
        console.log("Sikeres regisztráció!");
        onClose();
        try{ window.dispatchEvent(new Event('authChanged')); }catch(e){}

      } catch(err){
        console.error("Hiba történt a regisztráció során: ", err);
      }
    }
    else{
      alert("Kérlek töltsd ki a mezőket helyesen!");
    }
  }

  return (
    <div className="log_reg-overlay" onClick={onClose}>
      <div className="log_reg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log_reg-header">
          <h2>Regisztráció</h2>
          <div className="registrationLine"></div>
          <button className="log_reg-close" onClick={onClose} aria-label="Bezárás">x</button>
        </div>

        <form className="registration-form" onSubmit={handleRegistration}>
          <InputField type="text" name="name" labelText="Teljes név" refData={refName} isValid={isValided} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="text" name="username" labelText="Felhasználó név" refData={refUsername} isValid={isValided} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="email" name="email" labelText="E-mail cím" refData={refEmail} isValid={isValided} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="password" name="password" labelText="Jelszó" refData={refPassword} isValid={isValided} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="password" name="repassword" labelText="Ismételt jelszó" refData={refRePassword} isValid={isValided} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="tel" name="tel" labelText="Telefonszám" refData={refPhone} isValid={isValided} isEdited={isEdited} validateInputs={validateInputs}/>
          <InputField type="date" name="date" labelText="Születési dátum" refData={refBirthdate} isValid={isValided} isEdited={isEdited} validateInputs={validateInputs}/>
          <div className="log_reg-actions">
            <button className="registration-button" onClick={onRegister}>Regisztráció</button>
          </div>
        </form>
      </div>
    </div>
  );
}
