import Filter from "../components/filter";
import SearchBar from "../components/searchbar";
import products from "./products.module.css";
import Ads from "../components/ads";

export default function Products(){
    return(
        <>
            <div className={products.searchFilter}>
                <Filter page={products} />
                <div className={products.mainArea}>
                    <SearchBar page={products} />
                    <Ads page={products} />
                </div>
            </div>
        </>
    )
}