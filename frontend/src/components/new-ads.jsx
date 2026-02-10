import { useEffect, useState, useRef } from "react"
import Ad from "./ad"
import { getAuthToken } from "../util/auth";

export default function NewAd({page}){
        const token = getAuthToken();
        const [ads, setAds] = useState([]);
        const [cartIds, setCartIds] = useState([]);
        const [myAdIds, setMyAdIds] = useState([]);
        const scrollerRef = useRef(null);

        useEffect(() => {
                async function fetchAds() {
                    const response = await fetch("http://localhost:3000/backstagegear/latest_ads");
                    const resAds = await response.json();
                    setAds(resAds);
                }
                fetchAds();
        }, []);

        useEffect(() => {
                async function fetchCart() {
                    const currentToken = localStorage.getItem("token");
                    if (!currentToken) {
                        setCartIds([]);
                        return;
                    }
                    try {
                        const response = await fetch("http://localhost:3000/backstagegear/me/cart", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-access-token": currentToken
                            }
                        });
                        if (response.ok) {
                            const cartItems = await response.json();
                            setCartIds(cartItems.map((item) => item.id));
                        }
                    } catch (err) {
                    }
                }
                async function fetchMyAds() {
                    const currentToken = localStorage.getItem("token");
                    if (!currentToken) {
                        setMyAdIds([]);
                        return;
                    }
                    try {
                        const response = await fetch("http://localhost:3000/backstagegear/me/my_ads", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-access-token": currentToken
                            }
                        });
                        if (response.ok) {
                            const myAdsData = await response.json();
                            setMyAdIds(myAdsData.map((item) => item.id));
                        }
                    } catch (err) {
                    }
                }

                fetchCart();
                fetchMyAds();

                function handleAuthChange() { fetchCart(); fetchMyAds(); }
                window.addEventListener("authChanged", handleAuthChange);
                return () => window.removeEventListener("authChanged", handleAuthChange);
        }, []);

        function scrollByOffset(offset){
            if(!scrollerRef.current) return;
            scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }

        return(
                <section className={page.newAdSection}>
                        <h2 className={page.newAdText}>Nemrég feltöltött hirdetések:</h2>
                        <div className={page.carouselWrapper}>
                            <button className={page.carouselArrow + " " + page.left} aria-label="Previous" onClick={() => scrollByOffset(-scrollerRef.current.clientWidth * 0.8)}>‹</button>
                            <div className={page.newAds} ref={scrollerRef}>
                                {ads.map((ad) => (
                                    <Ad key={ad.id} adId={ad.id} adName={ad.name} adDesc={ad.description} adImg={ad.files} adPrice={ad.price} page={page} cartIds={cartIds} myAdIds={myAdIds}/>
                                ))}
                            </div>
                            <button className={page.carouselArrow + " " + page.right} aria-label="Next" onClick={() => scrollByOffset(scrollerRef.current.clientWidth * 0.8)}>›</button>
                        </div>
                </section>
        )
}