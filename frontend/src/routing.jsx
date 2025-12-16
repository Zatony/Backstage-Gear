import { useState,useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/navbar";
import Home from "./page_home/Home";
import About from "./page_about/about";
import Rules from "./page_rules/rules";

export default function Routing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refUsername = useRef(null);
  const refRePassword = useRef(null);
  const refPhone = useRef(null);
  const refBirthdate = useRef(null);

  //Login es register kezelok
  function handleLogin() {
    console.log("Login clicked");
    setShowLogin(true);
  }
  function handleCloseLogin() {
    setShowLogin(false);
  }
  function loginRequest() {
    console.log(refEmail.current.value + " - " + refPassword.current.value);
    setShowLogin(false);
  }
  function handleRegister() {
    setShowRegister(true);
    setShowLogin(false);
  }
  function handleCloseRegister() {
    setShowRegister(false);
  }
  function registerRequest() {
    console.log(refEmail.current.value + " - " + refPassword.current.value + " - " + refUsername.current.value + " - " + refRePassword.current.value + " - " + refPhone.current.value + " - " + refBirthdate.current.value);
    setShowRegister(false);
  }

  //cart kezelo
  function handleCart() {
    console.log("Cart clicked");
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <NavBar
          callLogin={handleLogin}
          callCart={handleCart}
          showLogin={showLogin}
          handleCloseLogin={handleCloseLogin}
          loginRequest={loginRequest}
          showRegister={showRegister}
          handleCloseRegister={handleCloseRegister}
          registerRequest={registerRequest}
          handleRegister={handleRegister}
          refEmail={refEmail}
          refPassword={refPassword}
          refUsername={refUsername}
          refRePassword={refRePassword}
          refPhone={refPhone}
          refBirthdate={refBirthdate}
        />
      ),
      errorElement: <div>Hiba történt az oldal betöltésekor.</div>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/rules",
          element: <Rules />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
