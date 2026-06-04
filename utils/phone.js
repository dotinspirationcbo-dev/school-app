// Simple phone normalization: strip non-digits, keep last 10-12 digits
function normalizePhone(input) {
  if (!input) return null;
  const digits = input.toString().replace(/[^0-9]/g, '');
  if (digits.length <= 10) return digits;
  // Keep last 10 digits for local numbers, or last 12 for international
  return digits.slice(-12);
}

module.exports = { normalizePhone };
