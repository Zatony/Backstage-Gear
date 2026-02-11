export default function SelectOption({ page, label, options, refInput }) {
  return (
    <div className={page.formRow}>
      <label>{label}:</label>
      <select ref={refInput}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name || option.brand_name}
          </option>
        ))}
      </select>
    </div>
  );
}
