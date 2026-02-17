import { useEffect, useState, useRef } from "react";
import { getAuthToken } from "../util/auth";
import newAd from "./newAd.module.css";
import { useNavigate } from "react-router-dom";
import AdFormHeader from "../components/AdFormHeader.jsx";
import AdFormFields from "../components/AdFormFields.jsx";
import AdFormActions from "../components/AdFormActions.jsx";

export default function NewAd() {
  const token = getAuthToken();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const itemName = useRef("");
  const categoryId = useRef("");
  const brandId = useRef("");
  const condition = useRef("");
  const price = useRef("");
  const image = useRef("");
  const description = useRef("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !itemName.current.value || !categoryId.current.value ||
      !brandId.current.value || !condition.current.value ||
      !price.current.value || !description.current.value
    ) {
      setError("Kérjük, tölts ki minden kötelező mezőt!");
      return;
    }

    const formData = new FormData();
    formData.append("categoryId", categoryId.current.value);
    formData.append("brandId", brandId.current.value);
    formData.append("itemName", itemName.current.value);
    formData.append("price", price.current.value);
    formData.append("condition", condition.current.value);
    formData.append("description", description.current.value);
    if (image.current.files[0]) {
      formData.append("files", image.current.files[0]);
    }

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:3000/backstagegear/me/new_ad", {
        method: "POST",
        headers: {
          "x-access-token": token,
        },
        body: formData
      });

      console.log(formData);

      if (res.ok) {
        alert("Hirdetés sikeresen létrehozva!");
        navigate("/my_ads");
      }
      else{
        throw new Error(res.statusText);
      }

    } catch (err) {
      setError("Valami hiba történt: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AdFormHeader page={newAd} title="Új hirdetés feltöltése" />

      <div className={newAd.formWrapper}>
        <form className={newAd.formCard} onSubmit={handleSubmit}>
          <AdFormFields
            page={newAd}
            itemNameRef={itemName}
            categoryIdRef={categoryId}
            brandIdRef={brandId}
            conditionRef={condition}
            priceRef={price}
            imageRef={image}
            descriptionRef={description}
            categories={categories}
            brands={brands}
          />

          <AdFormActions
            page={newAd}
            submitting={submitting}
            error={error}
            buttonText="Hirdetés létrehozása"
          />
        </form>
      </div>
    </>
  );
}
