// Utilitário para conversão e aplicação dinâmica da cor primária da loja

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function applyThemeColor(primaryHex: string) {
  if (!primaryHex || !primaryHex.startsWith('#')) return;

  const { h, s } = hexToHsl(primaryHex);
  const root = document.documentElement;

  // Ajusta as variáveis de tons do Tailwind v4 (pink) e as variáveis de marca
  root.style.setProperty('--color-brand-pink', primaryHex);
  root.style.setProperty('--color-brand-pink-dark', `hsl(${h}, ${s}%, 35%)`);
  root.style.setProperty('--color-brand-pink-light', `hsl(${h}, ${Math.max(s - 20, 30)}%, 96%)`);
  root.style.setProperty('--color-brand-pink-soft', `hsl(${h}, ${Math.max(s - 15, 30)}%, 91%)`);

  // Sobrescrever variáveis nativas do Tailwind v4 para a paleta pink
  root.style.setProperty('--color-pink-50', `hsl(${h}, ${Math.max(s - 20, 25)}%, 97%)`);
  root.style.setProperty('--color-pink-100', `hsl(${h}, ${Math.max(s - 15, 30)}%, 93%)`);
  root.style.setProperty('--color-pink-200', `hsl(${h}, ${s}%, 85%)`);
  root.style.setProperty('--color-pink-300', `hsl(${h}, ${s}%, 75%)`);
  root.style.setProperty('--color-pink-400', `hsl(${h}, ${s}%, 62%)`);
  root.style.setProperty('--color-pink-500', `hsl(${h}, ${s}%, 52%)`);
  root.style.setProperty('--color-pink-600', primaryHex);
  root.style.setProperty('--color-pink-700', `hsl(${h}, ${s}%, 38%)`);
  root.style.setProperty('--color-pink-800', `hsl(${h}, ${s}%, 30%)`);
  root.style.setProperty('--color-pink-900', `hsl(${h}, ${s}%, 22%)`);
  root.style.setProperty('--color-pink-950', `hsl(${h}, ${s}%, 15%)`);
}
