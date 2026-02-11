import { useEffect, useState, useRef } from "react";
import { getAuthToken } from "../util/auth";
import styles from "./editAd.module.css";
import SelectOption from "../components/selectOption";
import FormInput from "../components/formInput";
import TextAreaField from "../components/textAreaField";
import { useNavigate } from "react-router-dom";

export default function EditAd() {
  const token = getAuthToken();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const itemName = useRef("");
  const categoryId = useRef("");
  const brandId = useRef("");
  const condition = useRef("");
  const price = useRef("");
  const image = useRef(null);
  const availability = useRef("");
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

    const newAdData = {
      categoryId: categoryId.current.value,
      brandId: brandId.current.value,
      itemName: itemName.current.value,
      price: price.current.value,
      condition: condition.current.value,
      description: description.current.value,
    };
    console.log("Hirdetés adatai:", newAdData);

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:3000/backstagegear/me/new_ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(newAdData),
      });

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
      <div className={styles.editAdTextContainer}>
        <h1 className={styles.editAdText}>Hirdetés szerkesztése</h1>
        <div className={styles.editAdLine}></div>
      </div>

      <div className={styles.formWrapper}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>Termék neve:</label>
            <input type="text" ref={itemName} />
          </div>

          <SelectOption page={styles} label="Kategória" options={categories} refInput={categoryId} />
          <SelectOption page={styles} label="Márka" options={brands} refInput={brandId} />

          <div className={styles.formRow}>
            <label>Állapot:</label>
            <select ref={condition}>
              <option value="Új">Új</option>
              <option value="Használt">Használt</option>
              <option value="Sérült">Sérült</option>
            </select>
          </div>

          <FormInput page={styles} label="Ár" type="number" refInput={price} min="0" />
          <FormInput page={styles} label="Kép feltöltése" type="file" accept="image/*" refInput={image} />
          <FormInput page={styles} label="Elérhetőség" refInput={availability} />
          <TextAreaField page={styles} label="Leírás" refInput={description} />

          <div className={styles.submitBtnWrapper}>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              Módosítások mentése
            </button>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}
        </form>
      </div>
    </>
  );
}
