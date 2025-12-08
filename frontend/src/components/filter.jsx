import { useEffect, useState } from "react";
import { BRAND_NAMES } from "../data";

export default function Filter() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("http://localhost:3000/backstagegear");
      const resCategories = await response.json();
      setCategories(resCategories);
    }

    fetchCategories();
  }, []);

  function handelName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return (
    <div className="filter-container">
      <div className="filter-categories">
        <h3>Kategóriák</h3>
        {categories.map((category) => (
            <div key={"filterCategory-"+category.categoryId} className="filter-category filterCheckBox">
                <input type="checkbox" id={"filterCategory-"+category.categoryId} name="categories" value={category.categoryId}/>
                <label htmlFor={"filterCategory-"+category.categoryId}>{handelName(category.name)}</label>
            </div>
        ))}
      </div>
      <div className="filter-condition filterCheckBox" >
        <h3>Állapot</h3>
        <input type="checkbox" id="filterCondition1" name="conditions" value="új" />
        <label htmlFor="filterCondition1">Új</label>
        <input type="checkbox" id="filterCondition2" name="conditions" value="használt" />
        <label htmlFor="filterCondition2">Használt</label>
        <input type="checkbox" id="filterCondition3" name="conditions" value="sérült" />
        <label htmlFor="filterCondition3">Sérült</label>
      </div>
      <div className="filter-brand_price">
        <h3>Márka</h3>
        <select name="filterBrands">
            {BRAND_NAMES.map((brand) =>(<option key={brand.name} value={brand.name}>{brand.name}</option>))}
        </select>
      </div>
      <div className="price-row">
        <span>Ft:</span>
        <input type="number" placeholder="0" />
        <span>-</span>
        <input type="number" placeholder="1000000" />
      <div className="price-slider"></div>
  </div>
    </div>
  );
}
