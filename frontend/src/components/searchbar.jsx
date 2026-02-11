import searchIco from "../assets/searchIcon.png";
import filterIco from "../assets/filterIcon.png";
import { useState } from "react";

export default function SearchBar({ page, onFilter, onSearch, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);

  function handleSearch() {
    if (onSearch) onSearch(query);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className={page.searchbar}>
      {onFilter && <img src={filterIco} alt={filterIco} onClick={onFilter} />}
      <input
        className={page.searchInput}
        type="search"
        placeholder="Keresés..."
        name="searchbar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <img src={searchIco} alt={searchIco} onClick={handleSearch} />
    </div>
  );
}
