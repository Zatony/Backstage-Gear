export default function Category({ isLoading, loadingText, fallbackText, categories }) {

    function handelName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return(        
        <div className="categories-container">
            {isLoading && <p className="fallback-text">{loadingText}</p>}
            {!isLoading && categories.length === 0 && <p className="fallback-text">{fallbackText}</p>}
            {!isLoading && categories.length > 0 && (
                <>
                    {categories.map((category) => (
                        <div key={category.categoryId} className="category-container">
                            <img src={category.picture} alt={"category"+category.categoryId} />
                            <h3>{handelName(category.name)}</h3>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}