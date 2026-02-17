import SelectOption from "./selectOption.jsx";
import FormInput from "./formInput.jsx";
import TextAreaField from "./textAreaField.jsx";

export default function AdFormFields({
  page,
  itemNameRef,
  categoryIdRef,
  brandIdRef,
  conditionRef,
  priceRef,
  imageRef,
  descriptionRef,
  categories,
  brands,
  isEditing,
}) {
  return (
    <>
      <div className={page.formRow}>
        <label>Termék neve:</label>
        <input type="text" ref={itemNameRef} />
      </div>

      <SelectOption
        page={page}
        label="Kategória"
        options={categories}
        refInput={categoryIdRef}
      />
      <SelectOption
        page={page}
        label="Márka"
        options={brands}
        refInput={brandIdRef}
      />

      <div className={page.formRow}>
        <label>Állapot:</label>
        <select ref={conditionRef}>
          <option value="Új">Új</option>
          <option value="Használt">Használt</option>
          <option value="Sérült">Sérült</option>
        </select>
      </div>

      <FormInput
        page={page}
        label="Ár"
        type="number"
        refInput={priceRef}
        min="0"
      />
      <FormInput
        page={page}
        label="Kép feltöltése"
        type="file"
        accept="image/*"
        refInput={imageRef}
      />
      <TextAreaField
        page={page}
        label="Leírás"
        refInput={descriptionRef}
      />
    </>
  );
}
