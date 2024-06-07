type ValueOf<T> = T[keyof T];

export interface Typography {
  fontSize: "9px" | "11px" | "12px" | "13px" | "15px" | "18px" | "29px";
  lineHeight: "12px" | "16px" | "18px" | "20px" | "32px";
  wordWrap?: "break-word";
  letterSpacing?: string;
  textTransform?: "uppercase";
  fontWeight?: ValueOf<typeof fontWeight>;
  hyphens?: "auto";
}

export const fontWeight = {
  normal: 400,
  semibold: 600,
} as const;

export const titleSemibold29x32: Typography = {
  fontSize: "29px",
  fontWeight: fontWeight.semibold,
  lineHeight: "32px",
} as const;

export const titleSemibold18x20: Typography = {
  fontSize: "18px",
  fontWeight: fontWeight.semibold,
  lineHeight: "20px",
} as const;

export const titleSemibold15x20: Typography = {
  fontSize: "15px",
  fontWeight: fontWeight.semibold,
  lineHeight: "20px",
} as const;

export const bodyRegular13x16: Typography = {
  fontSize: "13px",
  fontWeight: fontWeight.normal,
  lineHeight: "16px",
} as const;

export const bodySemibold13x16: Typography = {
  ...bodyRegular13x16,
  fontWeight: fontWeight.semibold,
} as const;

export const bodyRegular12x16: Typography = {
  fontSize: "12px",
  fontWeight: fontWeight.normal,
  lineHeight: "16px",
} as const;

export const bodySemibold12x16: Typography = {
  fontSize: "12px",
  lineHeight: "16px",
  fontWeight: fontWeight.semibold,
} as const;

export const captionRegular11x12: Typography = {
  fontSize: "11px",
  fontWeight: fontWeight.normal,
  lineHeight: "12px",
} as const;

export const captionSemibold11x12: Typography = {
  ...captionRegular11x12,
  fontWeight: fontWeight.semibold,
} as const;

export const captionRegular11x16: Typography = {
  fontSize: "11px",
  lineHeight: "16px",
  fontWeight: fontWeight.normal,
};

export const captionRegular9x12: Typography = {
  fontSize: "9px",
  fontWeight: fontWeight.normal,
  lineHeight: "12px",
};

export const captionSemibold9x12: Typography = {
  ...captionRegular9x12,
  fontWeight: fontWeight.semibold,
};

export const uppercaseRegular11x12: Typography = {
  fontSize: "11px",
  fontWeight: fontWeight.normal,
  lineHeight: "12px",
  textTransform: "uppercase",
} as const;

export const uppercaseSemibold11x12: Typography = {
  ...uppercaseRegular11x12,
  fontWeight: fontWeight.semibold,
} as const;

export { titleSemibold18x20 as title };
export { bodyRegular13x16 as regular };
export { bodySemibold13x16 as regularSemibold };
export { captionRegular11x12 as small };

/**
 * Делает многострочный фейд в многоточие через -webkit-line-clamp.
 *
 * У элемента не должно быть вертикального padding,
 * чтобы не было ошибок с maxHeight.
 *
 * В IE11 это свойство не поддерживается: https://caniuse.com/#search=line-clamp
 * Тогда будет просто ограничена максимальная высота блока.
 *
 * Не забывай делать title для полного текста, чтобы юзер мог навести мышь и прочитать полный текст!
 *
 * @example
 *
 * clampedText: {
 *   color: text.base,
 *   ...lineClamped(3, regular),
 * }
 */
export function lineClamped(
  linesCount: number,
  typography: Typography,
): React.CSSProperties {
  return {
    ...typography,
    ...lineClampedWithoutTypography(linesCount, typography),
  };
}

export function lineClampedWithoutTypography(
  linesCount: number,
  typography: Typography,
): React.CSSProperties {
  const lineHeightNumber = parseInt(typography.lineHeight, 10);

  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: linesCount,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxHeight: lineHeightNumber ? linesCount * lineHeightNumber : undefined,
  };
}
