import { useEffect, useState } from "react";
import Ad from "./ad";

export default function Ads({ page, filters = {} }) {
    const [ads, setAds] = useState([]);
    const [cartIds, setCartIds] = useState([]);

    useEffect(() => {
        async function fetchAds() {
            const params = new URLSearchParams();
            if (filters.categoryId) params.append("categoryId", filters.categoryId);
            if (filters.brandId) params.append("brandId", filters.brandId);
            if (filters.minPrice) params.append("minPrice", filters.minPrice);
            if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
            if (filters.q) params.append("q", filters.q);

            const url = params.toString()
                ? `http://localhost:3000/backstagegear/filtered_ads?${params.toString()}`
                : "http://localhost:3000/backstagegear/ads";

            try {
                const response = await fetch(url);
                const resData = await response.json();
                setAds(resData.data || resData);
            } catch {
                setAds([]);
            }
        }
        fetchAds();
    }, [filters.categoryId, filters.brandId, filters.minPrice, filters.maxPrice, filters.q]);

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
                console.error("Hiba történt a kosár lekérése során: ", err);
            }
        }
        fetchCart();
    }, []);

    return (
        <>
            <div className={page.ads}>
                {ads.map((ad) => (
                    <Ad key={ad.id || ad.advertisementId} adId={ad.id || ad.advertisementId} adName={ad.name || ad.item_name} adDesc={ad.description} adImg={ad.files ? ad.files[0] : undefined} adPrice={ad.price} page={page} cartIds={cartIds} />
                ))}
            </div>
        </>
    );
}