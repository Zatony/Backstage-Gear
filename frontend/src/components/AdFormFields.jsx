import SelectOption from "./selectOption.jsx";
import InputField from "./inputField.jsx";

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
  isValid,
  isEdited,
  validateInputs,
}) {
  return (
    <>
      <InputField
        page={page}
        label="Termék neve"
        type="text"
        refInput={itemNameRef}
        fieldName="itemName"
        isValid={isValid?.itemName}
        isEdited={isEdited?.itemName}
        validateInputs={validateInputs}
      />

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

      <InputField
        page={page}
        label="Ár"
        type="number"
        refInput={priceRef}
        min="0"
        fieldName="price"
        isValid={isValid?.price}
        isEdited={isEdited?.price}
        validateInputs={validateInputs}
      />
      <InputField
        page={page}
        label="Kép feltöltése"
        type="file"
        accept="image/*"
        refInput={imageRef}
        fieldName="imageFile"
        isValid={isValid?.imageFile}
        isEdited={isEdited?.imageFile}
        validateInputs={validateInputs}
      />
      <InputField
        page={page}
        label="Leírás"
        type="textarea"
        refInput={descriptionRef}
        fieldName="description"
        isValid={isValid?.description}
        isEdited={isEdited?.description}
        validateInputs={validateInputs}
      />
    </>
  );
}
