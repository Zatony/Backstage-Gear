import { useState } from "react";
import "./styles/App.css";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import NewAd from "./components/new-ads";
import SearchBar from "./components/searchbar";
import Categories from "./components/categories";
import Login from "./components/login";
import Registration from "./components/registration";
import Filter from "./components/filter";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

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

  //filter kezelő
  function handleFilter() {
    console.log("Filter clicked");
    if (!showFilter)
      setShowFilter(true);
    else
      setShowFilter(false);
  }

  return (
    <>
      <NavBar callLogin={handleLogin} callCart={handleCart} />
      <SearchBar onFilter={handleFilter} />
      {showFilter && <Filter />}

      <main>
        <Categories />
      </main>

      <NewAd />
      <Footer />

      {showLogin && <Login onClose={handleCloseLogin} onLogin={loginRequest} callRegister={handleRegister} />}
      {showRegister && <Registration onClose={handleCloseRegister} onRegister={registerRequest} />}
    </>
  );
}

export default App;
