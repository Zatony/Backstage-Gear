import "./App.css";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import NewAd from "./components/new-ads";
import SearchBar from "./components/searchbar";

function App() {
  return (
    <>
      <NavBar />

      <SearchBar />
      <NewAd />

      <Footer />
    </>
  );
}

export default App;
