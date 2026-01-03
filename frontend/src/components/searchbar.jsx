import searchIco from '../assets/searchIcon.png'
import filterIco from '../assets/filterIcon.png'
import { Link } from 'react-router-dom';

export default function SearchBar({ page, onFilter }) {
    return(
        <div className= {page.searchbar}>
            {onFilter && <img src={filterIco} alt={filterIco} onClick={onFilter}/>}
            <input className= {page.searchInput} type="search" placeholder="Keresés..." name="searchbar"/>
            <Link to="/products"><img src={searchIco} alt={searchIco}/></Link>
        </div>
    )
}