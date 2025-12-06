import "./App.css";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import NewAd from "./components/new-ads";
import SearchBar from "./components/searchbar";
import Categories from "./components/categories";

function App() {
  return (
    <>
      <NavBar />
      <SearchBar />

      <main>
        <Categories />
      </main>

      <NewAd />
      <Footer />
    </>
  );
}

export default App;
