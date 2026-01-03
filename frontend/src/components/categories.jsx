import { useEffect, useState } from "react";
import Category from "./category";

export default function Categories({page}) {
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
    <section className={page.categoriesSection}>
      <h2>Kategóriák</h2>
      <div className={page.categoriesLine}></div>
      <Category
        page={page}
        isLoading={isFetching}
        loadingText="Kategóriák betöltése..."
        fallbackText="Nincsenek elérhető kategóriák."
        categories={categories}
      />
    </section>
  );
}
