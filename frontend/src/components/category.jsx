export default function Category({ categoryImg, categoryName }) {

    function handelName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return(
        <div className="category-container">
            <img src={categoryImg} alt={categoryImg} />
            <h3>{handelName(categoryName)}</h3>
        </div>
        
        // <div className="categories-container">
        //     {isLoading && <p className="fallback-text">{loadingText}</p>}
        //     {!isLoading && categories.length === 0 && <p className="fallback-text">{fallbackText}</p>}
        //     {!isLoading && categories.length > 0 && (
        //         <>
        //             {categories.map((category) => (
        //                 <div className="category-container">
        //                     <img src={category.picture} alt={category.picture} />
        //                     <h3>{handelName(category.name)}</h3>
        //                 </div>
        //             ))}
        //         </>
        //     )}
        // </div>
    )
}