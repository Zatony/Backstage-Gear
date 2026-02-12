import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filter from "../components/filter";
import SearchBar from "../components/searchbar";
import products from "./products.module.css";
import Ads from "../components/ads";

export default function Products(){
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const initialCategoryIds = searchParams.get("categoryIds") ? searchParams.get("categoryIds").split(",") : [];
    const initialBrandId = searchParams.get("brandId") || "";
    const initialConditions = searchParams.get("conditions") ? searchParams.get("conditions").split(",") : [];
    const initialMinPrice = searchParams.get("minPrice") || "";
    const initialMaxPrice = searchParams.get("maxPrice") || "";
    const [filters, setFilters] = useState({
        q: initialQuery,
        categoryIds: initialCategoryIds,
        brandId: initialBrandId,
        conditions: initialConditions,
        minPrice: initialMinPrice,
        maxPrice: initialMaxPrice,
    });

    function handleFilterChange(newFilters) {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }

    function handleSearch(query) {
        setFilters((prev) => ({ ...prev, q: query }));
    }

    return(
        <>
            <div className={products.searchFilter}>
                <Filter page={products} onFilterChange={handleFilterChange} />
                <div className={products.mainArea}>
                    <SearchBar page={products} onSearch={handleSearch} initialQuery={initialQuery} />
                    <Ads page={products} filters={filters} />
                </div>
            </div>
        </>
    )
}