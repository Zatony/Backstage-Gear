import { useEffect, useState } from "react";
import Ad from "./ad";

export default function Ads({ page }) {
    const [ads, setAds] = useState([]);
    const [cartIds, setCartIds] = useState([]);

    useEffect(() => {
        async function fetchAds() {
            const response = await fetch("http://localhost:3000/backstagegear/ads");
            const resAds = await response.json();
            setAds(resAds);
        }
        fetchAds();
    }, []);

    useEffect(() => {
        async function fetchCart() {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const response = await fetch("http://localhost:3000/backstagegear/me/cart", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    }
                });
                if (response.ok) {
                    const cartItems = await response.json();
                    setCartIds(cartItems.map((item) => item.id));
                }
            } catch (err) {
                // ignore
            }
        }
        fetchCart();
    }, []);

    return (
        <>
            <div className={page.ads}>
                {ads.map((ad) => (
                    <Ad key={ad.id} adId={ad.id} adName={ad.name} adDesc={ad.description} adImg={ad.image} adPrice={ad.price} page={page} cartIds={cartIds} />
                ))}
            </div>
        </>
    );
}