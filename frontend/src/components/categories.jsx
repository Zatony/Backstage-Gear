import { useEffect, useState } from "react";
import Category from "./category";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      setIsFetching(true);
      const response = await fetch("http://localhost:3000/backstagegear");
      const resCategories = await response.json();
      setCategories(resCategories);
      setIsFetching(false);
    }

    fetchCategories();
  }, []);

  return (
    <section className="categories-section">
      <h2>Kategóriák</h2>
      <div className="categoriesLine"></div>

      <div className="categories-container">
        {categories.map((category) => (
          <Category
            key={category.categoryId}
            categoryImg={category.picture}
            categoryName={category.name}
          />
        ))}
      </div>
    </section>

    //<section className="categories-section">
    //  <h2>Kategóriák</h2>
    //  <div className="categoriesLine"></div>
    //  <Category
    //    isLoading={isFetching}
    //    loadingText="Kategóriák betöltése..."
    //    fallbackText="Nincsenek elérhető kategóriák."
    //    categories={categories}
    //  />
    //</section>
  );
}
