import userIco from "../assets/userIcon.png";
import logoutIco from "../assets/logoutIco.png";
import shoppingCart from "../assets/shoppingCart.png";
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import Login from "../components/login";
import Registration from "../components/registration";
import { useEffect, useRef, useState } from "react";
import UserDropdownMenu from "./userDropdownMenu";

export default function NavBar({ callLogin, showLogin, handleCloseLogin, showRegister, handleCloseRegister, handleShowRegister, handleShowLogin, }) {
  const tokenFromLoader = useRouteLoaderData("root");
  const [token, setToken] = useState(tokenFromLoader);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("is_admin") == 1 ? true : false,
  );
  const [userData, setUserData] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function handleAuthChange() {
      setToken(localStorage.getItem("token"));
      setIsAdmin(localStorage.getItem("is_admin") == 1 ? true : false);
      setIsProfileOpen(false);
    }
    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  console.log("localStorage: ", localStorage);
  console.log("isAdmin: ", isAdmin);
  useEffect(() => {
    async function fetchUserProfile() {
      if (!token) return;
      setCartCount(0);
      try {
        const response = await fetch(
          "http://localhost:3000/backstagegear/me/my_profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          },
        );

        const resData = await response.json();
        if (response.ok) {
          console.log("Felhasználói adatok lekérve: ", resData);
          setUserData(resData);
        }
      } catch (err) {
        console.error("Hiba történt a felhasználói adatok lekérése során: ", err);
      }
    }

    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    async function fetchCart() {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/backstagegear/me/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });
        if (response.ok) {
          const cartItems = await response.json();
          setCartCount(cartItems.length);
        }
      } catch (err) {
        setCartCount(0);
        console.error("Hiba történt a kosár lekérése során: ", err);
      }
    }
    fetchCart();

    function handleCartChange() { fetchCart(); }
    window.addEventListener("cartChanged", handleCartChange);
    return () => window.removeEventListener("cartChanged", handleCartChange);
  }, [token]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isProfileOpen) return;

    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  function onProfileOpen(e) {
    if (isProfileOpen) setIsProfileOpen(false);
    else {
      const rect = e.target.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 20,
        right: window.innerWidth - (rect.right + 90),
      });
      setIsProfileOpen(true);
    }
  }

  function onCartOpen() {
    if (!token) {
      alert ("Jelentkezz vagy regisztrálj a művelethez!");
      return;
    }
    navigate("/cart");
  }
  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="logo">
          Backstage Gear
        </Link>
        <div className="navbarLine"></div>
        <ul className="nav-links">
          <li>
            <Link to="/rules">Szabályzat</Link>
          </li>
          <li>
            <Link to="/about">Rólunk</Link>
          </li>
        </ul>

        <img
          className="profile"
          src={token ? userData.profile_picture : userIco}
          alt="User"
          onClick={token ? onProfileOpen : callLogin}
        ></img>
        {token && isProfileOpen && (
          <UserDropdownMenu
            ref={dropdownRef}
            userData={userData}
            dropdownPos={dropdownPos}
            isAdmin={isAdmin}
            logoutIcon={logoutIco}
            onClose={() => setIsProfileOpen(false)}
          />
        )}
        <img
          className="cart"
          src={shoppingCart}
          alt="Cart"
          onClick={onCartOpen}
        />
        {token && cartCount > 0 && (
          <span className="cartCount">
            {cartCount}
          </span>
        )}
      </nav>

      {showLogin && (
        <Login onClose={handleCloseLogin} onShowRegister={handleShowRegister} />
      )}
      {showRegister && (
        <Registration
          onClose={handleCloseRegister}
          onShowLogin={handleShowLogin}
        />
      )}
    </header>
  );
}
