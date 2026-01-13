import userIco from "../assets/userIcon.png";
import logoutIco from "../assets/logoutIco.png";
import shoppingCart from "../assets/shoppingCart.png";
import { Outlet, Link } from "react-router-dom";
import Login from "../components/login";
import Registration from "../components/registration";
import { useEffect, useState } from "react";


export default function NavBar({ callLogin, callCart, showLogin, handleCloseLogin, showRegister, handleCloseRegister, handleShowRegister, handleShowLogin}) {
  const isLoggedIn = !!sessionStorage.getItem('token');
  const [userData, setUserData] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if(!isLoggedIn) return;

    const token = sessionStorage.getItem('token');

    async function fetchUserProfile() {
      try{
        const response = await fetch("http://localhost:3000/backstagegear/me/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });

        const resData = await response.json();
        if(response.ok){
          setUserData(resData[0]);
        }
      } catch(err){
        console.error("Hiba történt a felhasználói adatok lekérése során: ", err);
      }
    }

    fetchUserProfile();
  }, [isLoggedIn]);

  function handleLogout() {
    sessionStorage.removeItem('token');
    window.location.reload();
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
          <div className="user-dropdown" style={{top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px`}}>
            <div className="user-header">{userData.username}</div>
            <div className="userLine"></div>
            <a className="userMenuLink" href="#">Profil</a>
            <a className="userMenuLink" href="#">Üzenetek</a>
            <a className="userMenuLink" href="#">Hirdetések</a>
            <a className="userMenuLink" href="#">Új hirdetés</a>
            <a className="userMenuLogout"  onClick={handleLogout}><img src={logoutIco} alt="Logout"></img> Kilépés</a>
          </div>
        }
        <img
          className="cart"
          src={shoppingCart}
          alt="Cart"
          onClick={callCart}
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
