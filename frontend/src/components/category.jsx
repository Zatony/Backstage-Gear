export default function Category({categoryImg, categoryName}){
    return(
        <div className="category-container">
            <img src={categoryImg} alt={categoryImg} />
            <h3>{categoryName}</h3>
        </div>
    )
}