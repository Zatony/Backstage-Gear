import { useState } from "react";
import home from "./home.module.css";
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
      <div className={home.searchbarContainer}>
        <h2 className={home.searchText}>Keress a hirdetések között</h2>
        <div className={home.searchbarLine}></div>
        <SearchBar page={home} onFilter={handleFilter} />
      </div>
      {showFilter && <Filter page={home} />}

      <main>
        <Categories page={home} />
      </main>

      <NewAd page={home}/>
    </>
  );
}
