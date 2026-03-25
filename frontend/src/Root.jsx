import NavBar from "./components/navbar";
import { useEffect, useState } from "react";
import { getTokenDuration } from "./util/auth";
import { Outlet, useLoaderData, useSubmit, useRevalidator } from "react-router-dom";

export default function Root() {
  const token = useLoaderData();
  const submit = useSubmit();
  const revalidator = useRevalidator();

  useEffect(() => {
    const handleAuthChanged = () => {
      revalidator.revalidate();
    };
    window.addEventListener('authChanged', handleAuthChanged);
    return () => window.removeEventListener('authChanged', handleAuthChanged);
  }, [revalidator]);

  useEffect(() => {
    if (!token) return;

    const duration = getTokenDuration();

    if (duration === null || duration <= 0) {
      submit(null, { action: "/logout", method: "post" });
      return;
    }

    const timer = setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, duration);

    return () => clearTimeout(timer);
  }, [token, submit]);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  //Login es register kezelok
  function handleLogin() {
    setShowLogin(true);
  }
  function handleCloseLogin() {
    setShowLogin(false);
  }
  function handleShowRegister() {
    setShowRegister(true);
    setShowLogin(false);
  }
  function handleCloseRegister() {
    setShowRegister(false);
  }
  function handleShowLogin() {
    setShowLogin(true);
    setShowRegister(false);
  }

  return (
    <>
      <NavBar
        callLogin={handleLogin}
        showLogin={showLogin}
        handleCloseLogin={handleCloseLogin}
        showRegister={showRegister}
        handleCloseRegister={handleCloseRegister}
        handleShowRegister={handleShowRegister}
        handleShowLogin={handleShowLogin}
      />
        <Outlet />
    </>
  );
}
