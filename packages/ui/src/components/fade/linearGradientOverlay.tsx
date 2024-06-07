import { memo } from "react";

import { Direction } from "../../types";
import { createStyles, useStyles } from "../../hooks/useStyles";

import { colors } from "../colors";
import { durations } from "../animations";

import { GradientDirection, GradientPosition } from "./types";

const positionToName: Record<GradientPosition, string> = {
  top: "top",
  bottom: "bottom",
  start: "insetInlineStart",
  end: "insetInlineEnd",
};

const positionToDirection: Record<
  `${GradientPosition}:${GradientDirection}:${Direction}`,
  string
> = {
  // LTR
  "top:in:ltr": "to top",
  "top:out:ltr": "to bottom",
  "bottom:in:ltr": "to bottom",
  "bottom:out:ltr": "to top",
  "start:in:ltr": "to left",
  "start:out:ltr": "to right",
  "end:in:ltr": "to right",
  "end:out:ltr": "to left",
  // RTL
  "top:in:rtl": "to top",
  "top:out:rtl": "to bottom",
  "bottom:in:rtl": "to bottom",
  "bottom:out:rtl": "to top",
  "start:in:rtl": "to right",
  "start:out:rtl": "to left",
  "end:in:rtl": "to left",
  "end:out:rtl": "to right",
};

interface Props {
  direction: GradientDirection;
  position: GradientPosition;
  size: number | string;
  color?: string;
  hidden?: boolean;
}

export const LinearGradientOverlay = memo<Props>((props) => {
  const {
    size,
    direction = "in",
    position,
    color = colors.white,
    hidden = false,
  } = props;

  const { css, s, dir } = useStyles(styles);

  const inset =
    direction === "in"
      ? 0
      : `-${typeof size === "number" ? `${size}px` : size}`;

  return (
    <div
      className={css(s.gradient, hidden && s._hidden)}
      style={{
        [positionToName[position]]: inset,
        width: position === "start" || position === "end" ? size : undefined,
        height: position === "top" || position === "bottom" ? size : undefined,
        // rgba(255, 255 ,255, 0) вместо transparent, потому что у всех браузеров он rgba(255,255,255,0) а у Safari - rgba(0,0,0,0)
        // поэтому при градиенте в белый у всех браузеров получается прозрачность (в rgba() меняется только прозрачность)
        // а у Safari - серый цвет (меняются все цвеста с 0 до 255 + прозрачность)
        backgroundImage: `
          linear-gradient(
            ${positionToDirection[`${position}:${direction}:${dir}`]},
            rgba(255, 255 ,255, 0),
            ${color} 100%
          )`,
      }}
    />
  );
});
LinearGradientOverlay.displayName = "LinearGradientOverlay";

const styles = createStyles({
  gradient: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    transition: `opacity ${durations.short}ms`,
  },
  _hidden: {
    opacity: 0,
  },
});
