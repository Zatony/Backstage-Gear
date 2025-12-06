import { useEffect, useState, useRef } from "react"
import Ad from "./ad"

export default function NewAd(){

        const [ads, setAds] = useState([]);
        const scrollerRef = useRef(null);

        useEffect(() => {
                async function fetchAds() {
                    const response = await fetch("http://localhost:3000/backstagegear/ads");
                    const resAds = await response.json();
                    setAds(resAds);
                }
                fetchAds();
        }, []);

        function scrollByOffset(offset){
            if(!scrollerRef.current) return;
            scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }

        return(
                <section className="newAd-section">
                        <h2 className="newAdText">Nemrég feltöltött hírdetések:</h2>
                        <div className="carousel-wrapper">
                            <button className="carousel-arrow left" aria-label="Previous" onClick={() => scrollByOffset(-scrollerRef.current.clientWidth * 0.8)}>‹</button>
                            <div className="newAds" ref={scrollerRef}>
                                {ads.map((ad) => (
                                    <Ad key={ad.adId} adName={ad.usedItem} adDesc={ad.description} adImg={ad.image} adPrice={ad.price} />
                                ))}
                            </div>
                            <button className="carousel-arrow right" aria-label="Next" onClick={() => scrollByOffset(scrollerRef.current.clientWidth * 0.8)}>›</button>
                        </div>
                </section>
        )
}