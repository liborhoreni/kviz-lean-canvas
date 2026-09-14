export function playersLabel(count) {
  if (count === 1) return 'hráč';
  if (count >= 2 && count <= 4) return 'hráči';
  return 'hráčů';
}
