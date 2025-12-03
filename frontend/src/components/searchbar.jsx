import searchIco from '../assets/searchIcon.png'

export default function SearchBar(){
    return(
        <section className="searchbar-section">
            <input type="text" placeholder="Keresés..." />
            <button><img src={searchIco} alt="" /></button>
        </section>
    )
}