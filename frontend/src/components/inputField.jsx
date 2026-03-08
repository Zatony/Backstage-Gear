export default function InputField({
  type = "text",
  label,
  refInput,
  fieldName,
  isValid,
  isEdited,
  validateInputs,
  onChange,
  name,
  id,
  autoComplete,
  min,
  accept,
  disabled = false,
  defaultValue,
  readOnly = false,
  page,
  wrapperClassName,
  inputClassName,
  labelText,
  refData,
}) {
  const resolvedLabel = label || labelText;
  const resolvedRef = refInput || refData;
  const resolvedFieldName = fieldName || name || type;
  const isTextarea = type === "textarea";

  const isValidObj = typeof isValid === "object" && isValid !== null;
  const valid = isValidObj ? isValid[resolvedFieldName] : isValid;
  const edited = isValidObj ? isEdited[resolvedFieldName] : isEdited;
  const error = edited && valid !== undefined && !valid;

  const handleChange =
    onChange ||
    ((e) =>
      validateInputs && validateInputs(e.target.value, resolvedFieldName));
  const handleBlur = () =>
    validateInputs &&
    validateInputs(resolvedRef.current.value, resolvedFieldName);

  if (!page) {
    return (
      <div className={wrapperClassName || "log_reg-row"}>
        <div className="row">
          <div className="col-6">
            <label htmlFor={name}>{resolvedLabel}:</label>
          </div>
          <div className="col-6 text-end">
            {error && (
              <span className="input-error">Kérlek töltsd ki a mezőt!</span>
            )}
          </div>
        </div>
        <input
          type={type}
          id={id || name}
          name={name}
          autoComplete={autoComplete || type}
          ref={resolvedRef}
          disabled={disabled}
          readOnly={readOnly}
          defaultValue={defaultValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    );
  }

  if (isTextarea) {
    const placeholder = error ? "Kérlek töltsd ki a mezőt!" : "";
    return (
      <div className={wrapperClassName || page.formRowTextarea}>
        <label>{resolvedLabel}:</label>
        <textarea
          ref={resolvedRef}
          disabled={disabled}
          readOnly={readOnly}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={
            [inputClassName, error ? page.textareaError : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    );
  }

  const placeholder = error ? "Kérlek töltsd ki a mezőt!" : "";
  return (
    <div className={wrapperClassName || page.formRow}>
      <label>{resolvedLabel}:</label>
      <input
        type={type}
        min={min}
        accept={accept}
        ref={resolvedRef}
        disabled={disabled}
        readOnly={readOnly}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        id={id}
        name={name}
        placeholder={placeholder}
        className={
          [inputClassName, error ? page.inputError : ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
}
