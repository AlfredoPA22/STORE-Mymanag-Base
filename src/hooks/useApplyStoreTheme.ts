import { useEffect } from "react";
import { hexToHslTriple } from "../utils/color";
import { IStoreTheme } from "../utils/interfaces/StoreProduct";

const HSL_VARS: Record<string, keyof IStoreTheme> = {
  "--primary": "primary",
  "--primary-foreground": "primaryForeground",
  "--ring": "primary",
};

const HEX_VARS: Record<string, keyof IStoreTheme> = {
  "--color-primary": "primary",
  "--color-primary-dark": "primaryDark",
  "--color-dark": "dark",
  "--color-dark-light": "darkLight",
  "--color-light": "light",
};

/** Aplica el tema de colores de la empresa (si configuró uno) sobre las variables CSS globales. */
const useApplyStoreTheme = (theme?: IStoreTheme | null) => {
  useEffect(() => {
    const root = document.documentElement;

    if (!theme?.primary) {
      return;
    }

    Object.entries(HSL_VARS).forEach(([cssVar, key]) => {
      const hex = theme[key];
      const hsl = hex ? hexToHslTriple(hex) : null;
      if (hsl) root.style.setProperty(cssVar, hsl);
    });

    Object.entries(HEX_VARS).forEach(([cssVar, key]) => {
      const hex = theme[key];
      if (hex) root.style.setProperty(cssVar, hex);
    });

    return () => {
      [...Object.keys(HSL_VARS), ...Object.keys(HEX_VARS)].forEach((cssVar) => {
        root.style.removeProperty(cssVar);
      });
    };
  }, [theme?.primary, theme?.primaryDark, theme?.primaryForeground, theme?.dark, theme?.darkLight, theme?.light]);
};

export default useApplyStoreTheme;
