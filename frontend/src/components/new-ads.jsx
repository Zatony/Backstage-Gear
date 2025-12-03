import Ad from "./ad"

export default function NewAd(){
    return(
        <section className="newAd-section">
            <h2>Nemrég feltöltött hírdetések:</h2>

            {<Ad/>}
        </section>
    )
}