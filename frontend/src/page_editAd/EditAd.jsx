import { useEffect, useState, useRef } from "react";
import { getAuthToken } from "../util/auth";
import editAd from "./editAd.module.css";
import { useNavigate } from "react-router-dom";
import AdFormHeader from "../components/AdFormHeader.jsx";
import AdFormFields from "../components/AdFormFields.jsx";
import AdFormActions from "../components/AdFormActions.jsx";

export default function EditAd() {
  const token = getAuthToken();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [adData, setAdData] = useState(null);

  const itemName = useRef(null);
  const categoryId = useRef(null);
  const brandId = useRef(null);
  const condition = useRef(null);
  const price = useRef(null);
  const image = useRef(null);
  const description = useRef(null);

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isValid, setIsValid] = useState({
    itemName: false,
    categoryId: false,
    brandId: false,
    condition: false,
    price: false,
    description: false,
  });
  const [isEdited, setIsEdited] = useState({
    itemName: false,
    categoryId: false,
    brandId: false,
    condition: false,
    price: false,
    description: false,
  });

  function validateInputs(inputText, inputType) {
    if (inputText.trim().length === 0) {
      setIsValid((prevState) => ({ ...prevState, [inputType]: false }));
    } else {
      setIsValid((prevState) => ({ ...prevState, [inputType]: true }));
    }
    setIsEdited((prevState) => ({ ...prevState, [inputType]: true }));
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:3000/backstagegear/categories");
        const data = await response.json();
        if (response.ok) setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    }
    async function fetchBrands() {
      try {
        const response = await fetch("http://localhost:3000/backstagegear/brands");
        const data = await response.json();
        if (response.ok) setBrands(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    async function fetchAd() {
      const urlParams = new URLSearchParams(window.location.search);
      const adId = urlParams.get("id");
      if (!adId) return;
      try {
        const response = await fetch(`http://localhost:3000/backstagegear/me/my_ads/${adId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        });
        if (response.ok) {
          const resData = await response.json();
          const ad = Array.isArray(resData) ? resData[0] : resData;
          setAdData(ad);
          console.log("Hirdetés adatai: ", ad);
        }
      } catch (err) {
        setError("Nem sikerült betölteni a hirdetés adatait.");
      }
    }
    fetchAd();
  }, [token]);

  useEffect(() => {
    if (!adData || categories.length === 0 || brands.length === 0) return;
    
    const matchedCategory = categories.find(cat => cat.name === adData.category_name);
    const categoryIdToSet = matchedCategory ? matchedCategory.id : "";
    
    const matchedBrand = brands.find(br => br.brand_name === adData.brand_name);
    const brandIdToSet = matchedBrand ? matchedBrand.id : "";
    
    setTimeout(() => {
      if (itemName.current) itemName.current.value = adData.item_name || "";
      if (categoryId.current) {
        categoryId.current.value = categoryIdToSet;
      }
      if (brandId.current) {
        brandId.current.value = brandIdToSet;
      }
      if (condition.current) {
        const rawCondition = adData.item_condition || "Új";
        const conditionValue = rawCondition.charAt(0).toUpperCase() + rawCondition.slice(1);
        condition.current.value = conditionValue;
      }
      if (price.current) price.current.value = adData.price || "";
      if (description.current) description.current.value = adData.description || "";
    }, 100);
  }, [adData, categories, brands]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (
      !itemName.current.value || !categoryId.current.value ||
      !brandId.current.value || !condition.current.value ||
      !price.current.value || !description.current.value
    ) {
      setError("Kérjük, tölts ki minden kötelező mezőt!");
      return;
    }

    setError(null);
    const data = new FormData();
    data.append("categoryId", categoryId.current?.value || "");
    data.append("brandId", brandId.current?.value || "");
    data.append("itemName", itemName.current?.value || "");
    data.append("price", price.current?.value || "");
    data.append("condition", condition.current?.value || "");
    data.append("description", description.current?.value || "");

    if (image.current && image.current.files && image.current.files[0]) {
      data.append("files", image.current.files[0]);
    }

    setSubmitting(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const adId = urlParams.get("id");
      const res = await fetch(`http://localhost:3000/backstagegear/me/my_ads/update_ad/${adId}`, {
        method: "PATCH",
        headers: {
          "x-access-token": token,
        },
        body: data,
      });

      if (res.ok) {
        alert("Hirdetés sikeresen módosítva!");
        navigate("/my_ads");
      } else {
        const errorText = await res.text();
        throw new Error(`${res.status}: ${errorText}`);
      }
    } catch (err) {
      setError("Valami hiba történt: " + err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AdFormHeader page={editAd} title="Hirdetés szerkesztése" />

      <div className={editAd.formWrapper}>
        <form className={editAd.formCard} onSubmit={handleSubmit}>
          <AdFormFields
            page={editAd}
            itemNameRef={itemName}
            categoryIdRef={categoryId}
            brandIdRef={brandId}
            conditionRef={condition}
            priceRef={price}
            imageRef={image}
            descriptionRef={description}
            categories={categories}
            brands={brands}
            isValid={isValid}
            isEdited={isEdited}
            validateInputs={validateInputs}
          />

          <AdFormActions
            page={editAd}
            submitting={submitting}
            error={error}
            buttonText="Módosítások mentése"
          />
        </form>
      </div>
    </>
  );
}