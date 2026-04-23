import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Filter from "../components/filter";
import SearchBar from "../components/searchbar";
import products from "./products.module.css";
import Ads from "../components/ads";

export default function Products(){
    const location = useLocation();
    const preselectedFilters = location.state?.preselectedFilters || {};
    const initialQuery = preselectedFilters.q || "";
    const initialCategoryIds = preselectedFilters.categoryIds || [];
    const initialBrandId = preselectedFilters.brandId ? String(preselectedFilters.brandId) : "";
    const initialConditions = preselectedFilters.conditions || [];
    const initialMinPrice = preselectedFilters.minPrice || "";
    const initialMaxPrice = preselectedFilters.maxPrice || "";
    const [filters, setFilters] = useState({
        q: initialQuery,
        categoryIds: initialCategoryIds,
        brandId: initialBrandId,
        conditions: initialConditions,
        minPrice: initialMinPrice,
        maxPrice: initialMaxPrice,
    });
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth <= 900 : false
    );
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 900);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function handleFilterChange(newFilters) {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }

    function handleSearch(query) {
        setFilters((prev) => ({ ...prev, q: query }));
    }

    function handleFilter() {
        setShowFilter((prev) => !prev);
    }

    return(
        <>
            <div className={products.searchFilter}>
                {(!isMobile || showFilter) && (
                    <Filter
                        page={products}
                        onFilterChange={handleFilterChange}
                        initialFilters={filters}
                    />
                )}
                <div className={products.mainArea}>
                    <SearchBar
                        page={products}
                        onFilter={isMobile ? handleFilter : undefined}
                        onSearch={handleSearch}
                        initialQuery={initialQuery}
                    />
                    <Ads page={products} filters={filters} />
                </div>
            </div>
        </>
    )
}