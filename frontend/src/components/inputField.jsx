export default function InputField({type, name, labelText, refData, isValid, isEdited, validateInputs}) {
    return (
        <div className="log_reg-row">
            <div className="row">
              <div className="col-6">
                <label htmlFor={type}>{labelText}:</label>
              </div>
              <div className="col-6 text-end">
                {isEdited[type] && !isValid[type] && (<span className="input-error" >Kérlek töltsd ki a mezőt!</span>)}
              </div>
            </div>
            <input type={type} id={name} name={name} autoComplete={type} ref={refData} onBlur={() => validateInputs(refData.current.value, name)} onChange={() => validateInputs(refData.current.value, name)}/>
        </div>
    )
}