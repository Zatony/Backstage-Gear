import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/navbar";
import Home from "./page_home/Home";
import About from "./page_about/About";
import Rules from "./page_rules/Rules";
import Products from "./page_products/Products";
import List from "./page_list/List";
import MyAds from "./page_myAds/MyAds";

export default function Routing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  //Login es register kezelok
  function handleLogin() {
    console.log("Login clicked");
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <NavBar
          callLogin={handleLogin}
          showLogin={showLogin}
          handleCloseLogin={handleCloseLogin}
          showRegister={showRegister}
          handleCloseRegister={handleCloseRegister}
          handleShowRegister={handleShowRegister}
          handleShowLogin={handleShowLogin}
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
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/cart",
          element: <List />,
        },
        {
          path: "/my_ads",
          element: <MyAds />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
