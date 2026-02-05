import userIco from "../assets/userIcon.png";
import logoutIco from "../assets/logoutIco.png";
import shoppingCart from "../assets/shoppingCart.png";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Login from "../components/login";
import Registration from "../components/registration";
import { useEffect, useState } from "react";
import UserDropdownMenu from "./userDropdownMenu";


export default function NavBar({ callLogin, showLogin, handleCloseLogin, showRegister, handleCloseRegister, handleShowRegister, handleShowLogin}) {
  const isLoggedIn = !!sessionStorage.getItem('token');
  const isAdmin = sessionStorage.getItem('is_admin') == 1 ? true : false;
  const [userData, setUserData] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const navigate = useNavigate();

  console.log("sessionStorage: ", sessionStorage);
  console.log("isLoggedIn: ", isLoggedIn);
  console.log("isAdmin: ", isAdmin);
  useEffect(() => {
    if(!isLoggedIn) return;

    const token = sessionStorage.getItem('token');

    async function fetchUserProfile() {
      try{
        const response = await fetch("http://localhost:3000/backstagegear/me/my_profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });

        const resData = await response.json();
        if(response.ok){
          console.log("Felhasználói adatok lekérve: ", resData);
          setUserData(resData);
        }
      } catch(err){
        console.error("Hiba történt a felhasználói adatok lekérése során: ", err);
      }
    }

    fetchUserProfile();
  }, [isLoggedIn]);

  function handleLogout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('is_admin');
    setIsProfileOpen(false);
    navigate("/");
  }

  function onProfileOpen(e) {
    if (isProfileOpen)
      setIsProfileOpen(false);
    else {
      const rect = e.target.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 20,
        right: window.innerWidth - (rect.right + 90)
      });
      setIsProfileOpen(true);
    }
  }

  function onCartOpen(){
    navigate("/cart");
  }
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">Backstage Gear</Link>
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
          src={isLoggedIn ? userData.profile_picture : userIco}
          alt="User"
          onClick={isLoggedIn ? onProfileOpen : callLogin}
        ></img>
        {isLoggedIn && isProfileOpen && 
          <UserDropdownMenu userData={userData} dropdownPos={dropdownPos} isAdmin={isAdmin} handleLogout={handleLogout} logoutIcon={logoutIco}/>
        }
        <img
          className="cart"
          src={shoppingCart}
          alt="Cart"
          onClick={onCartOpen}
        ></img>
      </nav>

      {showLogin && (
        <Login
          onClose={handleCloseLogin}
          onShowRegister={handleShowRegister}
        />
      )}
      {showRegister && (
        <Registration
          onClose={handleCloseRegister}
          onShowLogin={handleShowLogin}
        />
      )}

      <Outlet/>
    </>
  );
}
