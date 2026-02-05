import { useEffect, useState } from "react";

export default function Filter({page}) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("http://localhost:3000/backstagegear/categories");
      const resCategories = await response.json();
      setCategories(resCategories);
    }
    async function fetchBrands() {
      const response = await fetch("http://localhost:3000/backstagegear/brands");
      const resBrands = await response.json();
      console.log("Fetched brands: ", resBrands);
      setBrands(resBrands);
    }

    fetchCategories();
    fetchBrands();
  }, []);

  function handleName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return (
    <div className={page.filterContainer + " " + page.show}>
      <div className={page.filterCategories}>
        <h3>Kategóriák</h3>
        <div className={page.filterLine}></div>

        <div className={page.filterCategoriesList}>
          {categories.map((category) => (
            <div key={"filterCategoryCH-"+category.id} className={page.filterCategory + " " + page.filterCheckBox}>
                <input type="checkbox" id={"filterCategory-"+category.id} name="categories" value={category.id}/>
                <label htmlFor={"filterCategory-"+category.id}>{handleName(category.name)}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={page.filterCondition + " " + page.filterCheckBox} >
        <h3>Állapot</h3>
        <div className={page.filterLine}></div>
        
        <div className={page.filterConditionList}>
          <input type="checkbox" id="filterCondition1" name="conditions" value="új" />
          <label htmlFor="filterCondition1">Új</label>
          <input type="checkbox" id="filterCondition2" name="conditions" value="használt" />
          <label htmlFor="filterCondition2">Használt</label>
          <input type="checkbox" id="filterCondition3" name="conditions" value="sérült" />
          <label htmlFor="filterCondition3">Sérült</label>
        </div>
      </div>

      <div className={page.filterBrandPrice}>
        <div className={page.brandRow}>
          <div>
            <h3>Márka</h3>
            <div className={page.filterLineBrand}></div>
          </div>

          <select className={page.filterBrands} name="filterBrands">
            {brands.map((brand) =>(<option key={brand.brand_name+brand.id} value={brand.id}>{brand.brand_name}</option>))}
          </select>
        </div>
        <div className={page.priceRow}>
          <div>
            <h3>Ár</h3>
            <div className={page.filterLinePrice}></div>
          </div>
          
          <div className={page.priceInputs}>
            <input type="number" placeholder="0 Ft" id={page.priceMin}/>
            <span> - </span>
            <input type="number" placeholder="10000 Ft" id={page.priceMax} />
          </div>
        </div>
      </div>
  </div>
  );
}
