import userIco from "../assets/userIcon.png";
import shoppingCart from "../assets/shoppingCart.png";
import { Outlet, Link } from "react-router-dom";
import Login from "../components/login";
import Registration from "../components/registration";


export default function NavBar({ callLogin, callCart, showLogin, handleCloseLogin, loginRequest, showRegister, handleCloseRegister, registerRequest, handleRegister, refEmail, refPassword, refUsername, refRePassword, refPhone, refBirthdate }) {
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
          src={userIco}
          alt="Profile"
          onClick={callLogin}
        ></img>
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
          onLogin={loginRequest}
          callRegister={handleRegister}
          refEmail={refEmail}
          refPassword={refPassword}
        />
      )}
      {showRegister && (
        <Registration
          onClose={handleCloseRegister}
          onRegister={registerRequest}
          refEmail={refEmail}
          refPassword={refPassword}
          refUsername={refUsername}
          refRePassword={refRePassword}
          refPhone={refPhone}
          refBirthdate={refBirthdate}
        />
      )}

      <Outlet/>
    </>
  );
}
