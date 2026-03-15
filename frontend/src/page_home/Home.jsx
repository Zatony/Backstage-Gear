import { useState } from "react";
import { useNavigate } from "react-router-dom";
import home from "./home.module.css";
import NewAd from "../components/new-ads";
import SearchBar from "../components/searchbar";
import Categories from "../components/categories";
import Filter from "../components/filter";

export default function Home() {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  function handleFilter() {
    setShowFilter((prev) => !prev);
  }

  function handleFilterChange(newFilters) {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }

  function handleSearch(query) {
    navigate("/products", {
      state: {
        preselectedFilters: {
          ...filters,
          q: query,
        },
      },
    });
  }

  return (
    <>
      <div className={home.searchbarContainer}>
        <h2 className={home.searchText}>Keress a hirdetések között</h2>
        <div className={home.searchbarLine}></div>
        <SearchBar page={home} onFilter={handleFilter} onSearch={handleSearch} />
      </div>
      {showFilter && <Filter page={home} onFilterChange={handleFilterChange} initialFilters={filters} />}

      <main>
        <Categories page={home} />
      </main>

      <NewAd page={home}/>
    </>
  );
}
