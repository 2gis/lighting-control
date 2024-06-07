import { CSSProperties, memo, PropsWithChildren } from "react";

import { createStyles, CSSInputTypes, useStyles } from "../../hooks/useStyles";
import {
  bodyRegular12x16,
  bodyRegular13x16,
  captionRegular11x12,
  captionRegular9x12,
  fontWeight,
  lineClampedWithoutTypography,
  titleSemibold15x20,
  titleSemibold18x20,
  titleSemibold29x32,
  Typography,
  uppercaseRegular11x12,
} from "../typography";

import { colors } from "../colors";

export type TypographyType =
  | "title29"
  | "title18"
  | "title15"
  | "body13"
  | "body12"
  | "caption11"
  | "caption9"
  | "uppercase";

export const basePadding: Record<
  TypographyType,
  [top: number, bottom: number]
> = {
  title29: [1, 7],
  title18: [3, 5],
  title15: [0, 0],
  body13: [3, 5],
  body12: [3, 5],
  caption11: [2, 2],
  caption9: [3, 1],
  uppercase: [2, 2],
};

const typography: Record<TypographyType, Typography> = {
  title29: { ...titleSemibold29x32 },
  title18: { ...titleSemibold18x20 },
  title15: { ...titleSemibold15x20 },
  body13: { ...bodyRegular13x16 },
  body12: { ...bodyRegular12x16 },
  caption11: { ...captionRegular11x12 },
  caption9: { ...captionRegular9x12 },
  uppercase: { ...uppercaseRegular11x12 },
};

interface TextProps {
  type?: TypographyType;
  semibold?: boolean;
  top?: -4 | -2 | 0 | 1 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22;
  bottom?: -4 | -2 | 0 | 2 | 3 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22;
  /**
   * @deprecated
   */
  inline?: boolean;
  styles?: CSSInputTypes | Array<CSSInputTypes | undefined>;
  inlineStyles?: CSSProperties;
  title?: string;
  color?: keyof typeof colors;
  lineClamp?: number;
}

export const Text = memo((p: PropsWithChildren<TextProps>) => {
  const { css, s } = useStyles(styles);
  const {
    type = "body13",
    semibold = false,
    top = 0,
    bottom = 0,
    title,
    color,
    lineClamp,
    inlineStyles,
  } = p;

  // Для laneClamp заменяем padding на margin,
  // Это связано с тем, что из-за паддингов можно увидеть строку, которая должна быть обрезана через lineClamp.
  let mutableStyles: CSSProperties = lineClamp
    ? {
        marginBlockStart: basePadding[type][0] + top,
        marginBlockEnd: basePadding[type][1] + bottom,
      }
    : {
        paddingBlockStart: basePadding[type][0] + top,
        paddingBlockEnd: basePadding[type][1] + bottom,
      };

  if (color) {
    mutableStyles["color"] = colors[color];
  }

  if (lineClamp) {
    mutableStyles = {
      ...lineClampedWithoutTypography(lineClamp, typography[type]),
      // добавили, чтобы не обрезались падинги из-за max-height, который даёт lineClamped
      boxSizing: "content-box",
      ...mutableStyles,
    };
  }

  if (inlineStyles) {
    mutableStyles = {
      ...mutableStyles,
      ...inlineStyles,
    };
  }

  if (!p.children) {
    return null;
  }

  const Tag = p.inline ? "span" : "div";

  return (
    <Tag
      className={css(
        type && s[type],
        semibold && s._semibold,
        ...(Array.isArray(p.styles) ? p.styles : [p.styles]),
      )}
      style={mutableStyles}
      title={title}
    >
      {p.children}
    </Tag>
  );
});
Text.displayName = "Text";

const styles = createStyles({
  ...(typography as any),
  _semibold: { fontWeight: fontWeight.semibold },
});
