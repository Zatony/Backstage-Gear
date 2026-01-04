import { useEffect, useState } from "react";
import Ad from "./ad";

export default function Ads({ page }) {
    const [ads, setAds] = useState([]);

    useEffect(() => {
                    async function fetchAds() {
                        const response = await fetch("http://localhost:3000/backstagegear/ads");
                        const resAds = await response.json();
                        setAds(resAds);
                    }
                    fetchAds();
            }, []);

    return (
        <>
            <div className={page.ads}>
                {ads.map((ad) => < Ad key={ad.id} adName={ad.name} adDesc={ad.description} adImg={ad.image} adPrice={ad.price} page={page}/>)}
            </div>
        </>
    );
}