import { useEffect, useState } from "react";

export default function Filter({ page, onFilterChange, initialFilters = {} }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(initialFilters.categoryIds)
      ? initialFilters.categoryIds.map((id) => Number(id))
      : []
  );
  const [selectedBrand, setSelectedBrand] = useState(
    initialFilters.brandId ? String(initialFilters.brandId) : ""
  );
  const [selectedConditions, setSelectedConditions] = useState(
    Array.isArray(initialFilters.conditions) ? initialFilters.conditions : []
  );
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || "");

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("http://localhost:3000/backstagegear/categories");
      const resCategories = await response.json();
      setCategories(resCategories);
    }
    async function fetchBrands() {
      const response = await fetch("http://localhost:3000/backstagegear/brands");
      const resBrands = await response.json();
      setBrands(resBrands);
    }

    fetchCategories();
    fetchBrands();
  }, []);

  function emitChange(newCategories, newBrand, newConditions, newMin, newMax) {
    if (onFilterChange) {
      onFilterChange({
        categoryIds: newCategories.length > 0 ? newCategories : [],
        brandId: newBrand,
        conditions: newConditions.length > 0 ? newConditions : [],
        minPrice: newMin,
        maxPrice: newMax,
      });
    }
  }

  function handleCategoryChange(e) {
    const val = parseInt(e.target.value, 10);
    const updated = e.target.checked
      ? [...selectedCategories, val]
      : selectedCategories.filter((id) => id !== val);
    setSelectedCategories(updated);
    emitChange(updated, selectedBrand, selectedConditions, minPrice, maxPrice);
  }

  function handleBrandChange(e) {
    setSelectedBrand(e.target.value);
    emitChange(selectedCategories, e.target.value, selectedConditions, minPrice, maxPrice);
  }

  function handleConditionChange(e) {
    const val = e.target.value;
    const updated = e.target.checked
      ? [...selectedConditions, val]
      : selectedConditions.filter((c) => c !== val);
    setSelectedConditions(updated);
    emitChange(selectedCategories, selectedBrand, updated, minPrice, maxPrice);
  }

  function handleMinPrice(e) {
    setMinPrice(e.target.value);
    emitChange(selectedCategories, selectedBrand, selectedConditions, e.target.value, maxPrice);
  }

  function handleMaxPrice(e) {
    setMaxPrice(e.target.value);
    emitChange(selectedCategories, selectedBrand, selectedConditions, minPrice, e.target.value);
  }

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
                <input type="checkbox" id={"filterCategory-"+category.id} name="categories" value={category.id} checked={selectedCategories.includes(Number(category.id))} onChange={handleCategoryChange}/>
                <label htmlFor={"filterCategory-"+category.id}>{handleName(category.name)}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={page.filterCondition + " " + page.filterCheckBox} >
        <h3>Állapot</h3>
        <div className={page.filterLine}></div>
        
        <div className={page.filterConditionList}>
          <input type="checkbox" id="filterCondition1" name="conditions" value="Új" checked={selectedConditions.includes("Új")} onChange={handleConditionChange} />
          <label htmlFor="filterCondition1">Új</label>
          <input type="checkbox" id="filterCondition2" name="conditions" value="Használt" checked={selectedConditions.includes("Használt")} onChange={handleConditionChange} />
          <label htmlFor="filterCondition2">Használt</label>
          <input type="checkbox" id="filterCondition3" name="conditions" value="Sérült" checked={selectedConditions.includes("Sérült")} onChange={handleConditionChange} />
          <label htmlFor="filterCondition3">Sérült</label>
        </div>
      </div>

      <div className={page.filterBrandPrice}>
        <div className={page.brandRow}>
          <div>
            <h3>Márka</h3>
            <div className={page.filterLineBrand}></div>
          </div>

          <select className={page.filterBrands} name="filterBrands" value={selectedBrand} onChange={handleBrandChange}>
            <option value="">Összes</option>
            {brands.map((brand) =>(<option key={brand.brand_name+brand.id} value={brand.id}>{brand.brand_name}</option>))}
          </select>
        </div>
        <div className={page.priceRow}>
          <div>
            <h3>Ár</h3>
            <div className={page.filterLinePrice}></div>
          </div>
          
          <div className={page.priceInputs}>
            <input type="number" placeholder="0 Ft" id={page.priceMin} value={minPrice} onChange={handleMinPrice}/>
            <span> - </span>
            <input type="number" placeholder="10000 Ft" id={page.priceMax} value={maxPrice} onChange={handleMaxPrice}/>
          </div>
        </div>
      </div>
  </div>
  );
}
