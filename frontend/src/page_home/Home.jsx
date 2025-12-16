import { useState } from "react";
import "../styles/App.css";
import Footer from "../components/footer";
import NewAd from "../components/new-ads";
import SearchBar from "../components/searchbar";
import Categories from "../components/categories";
import Filter from "../components/filter";

export default function Home() {
  const [showFilter, setShowFilter] = useState(false);

  //filter kezelő
  function handleFilter() {
    console.log("Filter clicked");
    if (!showFilter) setShowFilter(true);
    else setShowFilter(false);
  }
  return (
    <>
      <SearchBar onFilter={handleFilter} />
      {showFilter && <Filter />}

      <main>
        <Categories />
      </main>

      <NewAd />
      <Footer />
    </>
  );
}
