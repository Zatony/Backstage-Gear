export default function ProfileField({ page, label, value, isReadOnly = true, refInput, type = "text" }) {
  return (
    <div className={page.profileField}>
      <span className={page.profileFieldLabel}>{label}</span>
      <input
        className={page.profileFieldInput}
        defaultValue={value}
        readOnly={isReadOnly}
        ref={refInput}
        type={type}
      />
    </div>
  );
}