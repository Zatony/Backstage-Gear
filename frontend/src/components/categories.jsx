import { useEffect, useState } from "react";
import Category from "./category";

export default function Categories() {
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
    <section className="categories-section">
      <h2>Kategóriák</h2>
      <div className="categoriesLine"></div>

      <div className="categories-container">
        {categories.map((category) => (
          <Category
            key={category.categoryId}
            categoryImg={category.picture}
            categoryName={handelName(category.name)}
          />
        ))}
      </div>
    </section>
  );
}
