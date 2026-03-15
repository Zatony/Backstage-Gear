import { useNavigate } from "react-router-dom";

export default function Category({ page, isLoading, loadingText, fallbackText, categories }) {
  const navigate = useNavigate();

  function handleName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function handleClick(categoryId) {
    navigate("/products", {
      state: {
        preselectedFilters: {
          categoryIds: [categoryId],
        },
      },
    });
  }

  return (
    <div className={page.categoriesContainer}>
      {isLoading && <p className={page.fallbackText}>{loadingText}</p>}
      {!isLoading && categories.length === 0 && (
        <p className={page.fallbackText}>{fallbackText}</p>
      )}
      {!isLoading && categories.length > 0 && (
        <>
          {categories.map((category) => (
            <div
              key={"category" + category.id}
              className={page.categoryContainer}
              onClick={() => handleClick(category.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={category.picture} alt={"category" + category.id} />
              <h3>{handleName(category.name)}</h3>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
