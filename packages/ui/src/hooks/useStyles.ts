import { createStyles as _createStyles, useKitTheme } from "@2gis-kit/css";

// То, что принимает функция css. Такого уровня детализации хватит, чтобы тайпскрипт ругался, если делаем фигню.
// Но сама функция css ругаться не будет, т.к. принимает any
export interface CssObjectForAphrodite {
  _name: any;
  _definition: any;
}

export type CSSInputTypes =
  | CssObjectForAphrodite
  | string
  | false
  | null
  | void;

export type CompiledClassNames<T extends string> = {
  [name in T]: CssObjectForAphrodite;
};

/**
 * @deprecated createStyles возвращает функцию hook аналогичную useStyles, данный метод более не актуален.
 */
export function useStyles(_useStyles: any) {
  const theme = useKitTheme();
  const { classes, cx } = _useStyles(null);

  return {
    s: classes,
    dir: theme.dir,
    css: cx,
    theme,
  };
}

export const createStyles = _createStyles;
