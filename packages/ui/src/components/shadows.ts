import { colors } from "./colors";

export const shadows = {
  outerRight: "1px 0 3px 0 rgba(38, 38, 38, 0.25)", // обрамляет dataViewer справа
  outerLeft: "-1px 0 3px 0 rgba(38, 38, 38, 0.25)", // обрамляет активный фрейм слева
  outerLeftSidebar: `0px 3px 10px rgba(0, 0, 0, 0.07)`, // обрамляет мини сайдбар слева
  popup: `0 1px 3px 0 rgba(38, 38, 38, .5)`,
  innerBorderBase: `inset 0 0 0 1px ${colors.gray_e6e6e6}`,
  innerBorder: (color: string) => `inset 0 0 0 1px ${color}`,
  innerBorderBottom: `inset 0 -1px ${colors.gray_e6e6e6}`,
  innerBorderTop: `inset 0 1px ${colors.gray_e6e6e6}`,
  chartTooltipShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)",
  popoverShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)",
  blockOuterShadow: "0px 3px 10px rgba(0, 0, 0, 0.07)", // обрамляет dataViewer справа
  mapControl: "0px 3px 10px 0px rgba(0, 0, 0, 0.07)",
};
