export default function FormInput({ page, label, type = "text", refInput, min, accept }) {
  return (
    <div className={page.formRow}>
      <label>{label}:</label>
      <input
        type={type}
        min={min}
        accept={accept}
        ref={refInput}
      />
    </div>
  );
}
