// Veselá směsice postaviček – zvířata, ovoce, zelenina a pár dalších kamarádů.
// Schválně namíchané napřeskáčku, ne po kategoriích.
export const AVATARS = [
  '🦊', '🍉', '🐸', '🥕', '🐙', '🍓', '🦄', '🍆',
  '🐨', '🍍', '🦁', '🥦', '🐵', '🍌', '🐰', '🌽',
  '🦖', '🥝', '🐳', '🍅', '🦉', '🥑', '🐝', '🍑',
  '🐧', '🍒', '🦔', '🥔', '🐢', '🍇', '🦋', '🌶️',
  '🚀', '🎈', '🍩', '🌈',
];

export function shuffledAvatars() {
  const arr = [...AVATARS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
