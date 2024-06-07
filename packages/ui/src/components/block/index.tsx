import { memo, PropsWithChildren } from "react";

import { createStyles, CSSInputTypes, useStyles } from "../../hooks/useStyles";

import { divider, dividerTop } from "../styles";

type PaddingUnit = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 36 | 56;
type MarginUnit = 0 | 4 | 8 | 16 | 24;

interface Props {
  padding?:
    | PaddingUnit
    | [PaddingUnit, PaddingUnit]
    | [PaddingUnit, PaddingUnit, PaddingUnit]
    | [PaddingUnit, PaddingUnit, PaddingUnit, PaddingUnit];
  margin?:
    | MarginUnit
    | [MarginUnit, MarginUnit]
    | [MarginUnit, MarginUnit, MarginUnit]
    | [MarginUnit, MarginUnit, MarginUnit, MarginUnit];
  divider?: boolean;
  dividerPosition?: "bottom" | "top";
  styles?: CSSInputTypes | Array<CSSInputTypes>;
  onClick?: () => void;
}

export const Block = memo<PropsWithChildren<Props>>(
  ({
    divider,
    dividerPosition = "bottom",
    padding,
    margin,
    onClick,
    styles: aphroditeStyles,
    children,
  }) => {
    const { css, s } = useStyles(styles);

    return (
      <div
        onClick={onClick}
        className={css(
          divider && dividerPosition === "bottom" && s.dividerBottom,
          divider && dividerPosition === "top" && s.dividerTop,
          onClick && s.hasHandler,
          ...(Array.isArray(aphroditeStyles)
            ? aphroditeStyles
            : [aphroditeStyles]),
        )}
        style={{
          ...getCssIndents(padding, "padding"),
          ...getCssIndents(margin, "margin"),
        }}
      >
        {children}
      </div>
    );
  },
);
Block.displayName = "Block";

const styles = createStyles({
  dividerBottom: {
    ...divider,
  },
  dividerTop: {
    ...dividerTop,
  },

  hasHandler: {
    cursor: "pointer",
  },
});

type LogicalIndentPostfix = "Top" | "InlineEnd" | "Bottom" | "InlineStart";
type LogicalIndent<T extends "padding" | "margin"> = Record<
  `${T}${LogicalIndentPostfix}`,
  number
>;

function getCssIndents<T extends "padding" | "margin">(
  p:
    | number
    | [number, number]
    | [number, number, number]
    | [number, number, number, number]
    | undefined,
  type: T,
) {
  let n: [number, number, number, number] | undefined;

  if (typeof p === "number") {
    n = [p, p, p, p];
  } else if (Array.isArray(p)) {
    if (p.length === 2) {
      n = [p[0], p[1], p[0], p[1]];
    }

    if (p.length === 3) {
      n = [p[0], p[1], p[2], p[1]];
    }

    if (p.length === 4) {
      n = [p[0], p[1], p[2], p[3]];
    }
  }

  return n
    ? ({
        [`${type}Top`]: n[0],
        [`${type}InlineEnd`]: n[1],
        [`${type}Bottom`]: n[2],
        [`${type}InlineStart`]: n[3],
      } as LogicalIndent<T>)
    : undefined;
}
