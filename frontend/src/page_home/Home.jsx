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
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.brandId) params.append("brandId", filters.brandId);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    navigate(`/products?${params.toString()}`);
  }

  return (
    <>
      <div className={home.searchbarContainer}>
        <h2 className={home.searchText}>Keress a hirdetések között</h2>
        <div className={home.searchbarLine}></div>
        <SearchBar page={home} onFilter={handleFilter} onSearch={handleSearch} />
      </div>
      {showFilter && <Filter page={home} onFilterChange={handleFilterChange} />}

      <main>
        <Categories page={home} />
      </main>

      <NewAd page={home}/>
    </>
  );
}
