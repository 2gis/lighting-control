import { memo } from "react";

import { createStyles, useStyles } from "../../hooks/useStyles";

import { colors } from "../colors";

import { LinearGradientOverlay } from "./linearGradientOverlay";
import { GradientDirection, GradientPosition } from "./types";

export interface Props {
  /** Элемент для которого нужен градиент */
  children: React.ReactChild;
  /**
   * Направление градиента
   *
   * - `in` — градиент от границ внутрь компонента
   * - `out` — градиент от границ наружу компонента
   *
   * default — `in`
   */
  direction?: GradientDirection;
  /** Позиция градиента */
  position: GradientPosition | GradientPosition[];
  /**
   * Ширина и/или высота градиента
   *
   * Задаётся либо числом, либо строкой с указанием единицы измерения,
   * например, `100`, `16px` или `25%`
   */
  size: number | string;
  /**
   * Цвет градиента
   *
   * default — `transparent`
   */
  color?: string;
  /**
   * Нужно ли скрыть градиент?
   *
   * default — `false`
   */
  hidden?: boolean;
}

/**
 * Градиент-оверлей
 *
 * Градиент начинается с прозрачного цвета, а заканчивается цветом указанным в `color`.
 */
export const Fade = memo<Props>((props) => {
  const {
    children,
    size,
    direction = "in",
    position,
    color = colors.white,
    hidden = false,
  } = props;

  const { css, s } = useStyles(styles);

  const gradientsPosition =
    typeof position === "string" ? [position] : position;

  return (
    <div className={css(s.fadeWrapper)}>
      {gradientsPosition.map((pos) => (
        <LinearGradientOverlay
          key={`${pos}_${direction}`}
          direction={direction}
          position={pos}
          size={size}
          color={color}
          hidden={hidden}
        />
      ))}

      {children}
    </div>
  );
});
Fade.displayName = "Fade";

const styles = createStyles({
  fadeWrapper: {
    content: '""',
    position: "relative",
    top: 0,
    insetInlineStart: 0,
    width: "100%",
    height: "100%",
    isolation: "isolate",
  },
});
