import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./homepage/Homepage";
import { useState } from "react";
import Login from "./components/login";
import Registration from "./components/registration";
import NavBar from "./components/navbar";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  //Login es register kezelok
  function handleLogin() {
    setShowLogin(true);
  }
  function handleCloseLogin() {
    setShowLogin(false);
  }
  function loginRequest() {
    console.log("Login submitted");
    setShowLogin(false);
  }

  function handleRegister() {
    setShowRegister(true);
    setShowLogin(false);
  }
  function handleCloseRegister() {
    setShowRegister(false);
    setShowLogin(true);
  }
  function registerRequest() {
    console.log("Register submitted");
    setShowRegister(false);
  }

  //cart kezelő
  function handleCart() {
    console.log("Cart clicked");
  }

  return (
    <BrowserRouter>
      <NavBar callLogin={handleLogin} callCart={handleCart} />
      {showLogin && (
        <Login
          onClose={handleCloseLogin}
          onLogin={loginRequest}
          callRegister={handleRegister}
        />
      )}
      {showRegister && (
        <Registration
          onClose={handleCloseRegister}
          onRegister={registerRequest}
        />
      )}
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
