import "./App.css";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import NewAd from "./components/new-ads";
import SearchBar from "./components/searchbar";
import Category from "./components/category";

function App() {
  return (
    <>
      <NavBar />
      <SearchBar />
      <Category/>
      <NewAd />
      <Footer />
    </>
  );
}

export default App;
