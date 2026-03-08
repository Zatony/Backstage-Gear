export function formatHungarianPhone(input) {
  if (!input) return "";
  let digits = String(input).replace(/\D/g, "");

  if (digits.startsWith("36")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("06")) {
    digits = digits.slice(2);
  }

  if (digits.length !== 9) {
    return input;
  }

  const area = digits.slice(0, 2);
  const part1 = digits.slice(2, 5);
  const part2 = digits.slice(5);

  return `+36 ${area} ${part1} ${part2}`;
}

export function unformatHungarianPhone(input) {
  if (input == null) return null;
  const digits = String(input).replace(/\D/g, "");
  if (digits.length === 9) {
    return `36${digits}`;
  }
  if (digits.length === 11) {
    if (digits.startsWith("36")) return digits;
    if (digits.startsWith("06")) return `36${digits.slice(2)}`;
  }
  if (digits.startsWith("36") && digits.length > 11) return digits.slice(0, 11);
  return null;
}

export function formatPhoneInput(input) {
  const digits = String(input).replace(/\D/g, "");
  if (digits.length === 0) return "";
  
  const limited = digits.slice(0, 11);
  
  if (limited.length <= 2) {
    return "+36";
  } else if (limited.length <= 4) {
    return `+36 ${limited.slice(2)}`;
  } else if (limited.length <= 7) {
    return `+36 ${limited.slice(2, 4)} ${limited.slice(4)}`;
  } else {
    return `+36 ${limited.slice(2, 4)} ${limited.slice(4, 7)} ${limited.slice(7)}`;
  }
}

export function createPhoneChangeHandler(phoneRef, validateInputs, fieldName = 'tel') {
  return (e) => {
    const value = e.target.value;
    const formatted = formatPhoneInput(value);
    if (phoneRef.current) {
      phoneRef.current.value = formatted;
    }
    validateInputs(formatted, fieldName);
  };
}
