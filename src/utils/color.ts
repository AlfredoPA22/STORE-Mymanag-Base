interface HSL {
  h: number;
  s: number;
  l: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export const hexToHsl = (hex: string): HSL => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

/** Convierte un hex (#rrggbb) al formato "H S% L%" que usan las variables HSL de Tailwind/shadcn. */
export const hexToHslTriple = (hex: string): string | null => {
  if (!/^#([0-9a-f]{6})$/i.test(hex)) return null;
  const { h, s, l } = hexToHsl(hex);
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
};

export const hslToHex = (h: number, s: number, l: number): string => {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;

  const k = (n: number) => (n + hue / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

const darken = (hex: string, amount: number) => {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, clamp(l - amount, 0, 100));
};

const pickForeground = (hex: string) => {
  const { l } = hexToHsl(hex);
  return l > 60 ? "#0b2e38" : "#ffffff";
};

/**
 * Deriva los colores secundarios de un tema (dark, darkLight, light, etc.) a
 * partir del color principal — misma fórmula que usa el admin al generar un
 * tema desde un color base (ver Mymanag Front/CLIENT-Mymanag-Base/src/utils/storeTheme.ts).
 * Se usa para completar temas guardados con solo `primary`, así el navbar,
 * el footer y el resto de la tienda siempre quedan acordes a la marca en vez
 * de caer en el color oscuro por defecto.
 */
export const deriveThemeFromPrimary = (baseHex: string) => {
  const { h, s } = hexToHsl(baseHex);
  const darkSaturation = clamp(s * 0.6, 25, 45);
  const lightHue = (h + 150) % 360;

  return {
    primary: baseHex,
    primaryDark: darken(baseHex, 12),
    primaryForeground: pickForeground(baseHex),
    dark: hslToHex(h, darkSaturation, 16),
    darkLight: hslToHex(h, darkSaturation, 24),
    light: hslToHex(lightHue, clamp(s, 50, 70), 55),
  };
};
