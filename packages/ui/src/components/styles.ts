import { durations } from "./animations";
import { colors } from "./colors";

const getDivider = (position: "top" | "bottom"): any => ({
  position: "relative",

  "::before": {
    position: "absolute",
    content: '""',
    display: "block",
    borderBottom: `1px solid ${colors.black_01}`,
    top: position === "top" ? 0 : "unset",
    bottom: position === "bottom" ? 0 : "unset",
    right: 0,
    left: 0,
  },
});

export const divider = getDivider("bottom");
export const dividerTop = getDivider("top");

export const getLockedBackground = (color: string) =>
  `repeating-linear-gradient(-45deg, transparent 0 6px, ${color} 6px 8px)`;

export const linkStyle = {
  blue_1b61e1: {
    color: colors.blue_1b61e1,
    transition: `color ${durations.short}ms`,

    "&:hover, &:focus": {
      cursor: "pointer",
      color: colors.blue_0028a6,
    },
  },
};
