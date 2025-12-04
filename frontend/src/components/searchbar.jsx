import searchIco from '../assets/searchIcon.png'

export default function SearchBar(){
    return(
        <div className='searchbar-container'>
            <h2 className="search-text">Keress a hírdetések között</h2>
            <div className="searchbar">
                <input className="search-input" type="search" placeholder="Keresés..." />
                <img src={searchIco} alt="" />
            </div>
        </div>
        
    )
}