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
