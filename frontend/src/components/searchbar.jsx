import searchIco from '../assets/searchIcon.png'
import filterIco from '../assets/filterIcon.png'

export default function SearchBar({ onFilter }){
    return(
        <div className='searchbar-container'>
            <h2 className="search-text">Keress a hírdetések között</h2>
            <div className='searchbarLine'></div>
            <div className="searchbar">
                <img src={filterIco} alt={filterIco} onClick={onFilter}/>
                <input className="search-input" type="search" placeholder="Keresés..." name="searchbar"/>
                <img src={searchIco} alt={searchIco} />
            </div>
        </div>
        
    )
}