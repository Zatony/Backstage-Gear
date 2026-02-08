export default function TextAreaField({ page, label, refInput }) {
  return (
    <div className={page.formRowTextarea}>
      <label>{label}:</label>
      <textarea ref={refInput} />
    </div>
  );
}
