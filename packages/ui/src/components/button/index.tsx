import React, { memo, PropsWithChildren, useCallback } from "react";

import { createStyles, useStyles } from "../../hooks/useStyles";

import { shadows } from "../shadows";
import { colors } from "../colors";
import { Icon } from "../icon";
import { size } from "../layout";
import { durations } from "../animations";
import { Text } from "../text";
import { Block } from "../block";

import { useButtonStyles } from "./utils";

export type Props = {
  /**
   * Внешний вид кнопки
   */
  appearance?: "primary" | "secondary" | "tertiary";
  /**
   * Ссылка
   */
  href?: string;
  /**
   * Ссылка на внешний источник и её нужно открыть в новой вкладке браузера
   */
  external?: boolean;
  /**
   * Если кнопка используется внутри формы, то ей нужно указать type="submit"
   */
  type?: "submit";
  /**
   * Иконка
   */
  icon?: React.ReactNode;
  /**
   * Как должна позиционироваться иконка в кнопке:
   * - start - по левому краю, если RTL по правому.
   * - end - по правому краю, если RTL по левому.
   */
  iconPosition?: "start" | "end";
  /**
   * Левая иконка
   */
  iconLeft?: React.ReactNode;
  /**
   * Правая иконка
   */
  iconRight?: React.ReactNode;
  /**
   * В какую сторону будет появляться контент кнопки при ховере.
   * Работает только с кнопками у которых hiddenContent: true.
   */
  animationDirection?: "toStart" | "toEnd";
  /**
   * Текст который появится при наведении на кнопку.
   *
   * @example
   * Может быть полезно когда кнопка не содержит текст, а только иконку.
   */
  title?: string;
  /**
   * Кнопка на всю ширину контейнера
   */
  wide?: boolean;
  /**
   * Кнопка низкая и узкая из-за отсутствия паддингов
   */
  compact?: boolean;
  /**
   * Кнопка высокая и широкая из-за больших падингов
   */
  fat?: boolean;
  /**
   *  У лейбла кнопки отсутствуют дополнительные паддинги по бокам
   */
  smallLabel?: boolean;
  /**
   * Кнопка овальная/круглая
   */
  round?: boolean;
  /**
   * Скрыть контент кнопки и показать его при ховере
   */
  hiddenContent?: boolean;
  /**
   * Кнопка задизейблена?
   */
  disabled?: boolean;
  /**
   * Функция, которая будет вызвана при клике на кнопку
   */
  onClick?: () => void;
  locatorState?: string;
};

export const Button = memo<PropsWithChildren<Props>>((props) => {
  const {
    appearance = "primary",
    icon,
    iconLeft,
    iconRight,
    iconPosition = "start",
    type = "button",
    href,
    external,
    disabled = false,
    wide = false,
    round = false,
    fat = false,
    compact = false,
    smallLabel = false,
    hiddenContent = false,
    animationDirection = "toStart",
    title,
    children,
    onClick,
  } = props;

  const { css, s } = useStyles(styles);

  const isIconOnStart = !!(icon && iconPosition === "start") || !!iconLeft;
  const isIconOnEnd = !!(icon && iconPosition === "end") || !!iconRight;

  const { buttonStyles, contentStyles } = useButtonStyles({
    appearance,
    wide,
    round,
    fat,
    compact,
    hiddenContent,
    isIconOnStart,
    isIconOnEnd,
  });

  const clickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (external) {
        // если кнопка никак не пытается обрабатывать клик, то это делает кто-то выше
        e.stopPropagation();
      }
      if (disabled) {
        return;
      }

      if (onClick) {
        onClick();
      }
    },
    [external, onClick, disabled],
  );

  if (href) {
    const rel = external ? "noopener noreferrer" : undefined;
    const target = external ? "_blank" : "_self";

    return (
      <div className={css(s.wrapper, s[animationDirection], wide && s._wide)}>
        <a
          className={css(s.base, s.link, ...buttonStyles)}
          href={href}
          target={target}
          rel={rel}
          onClick={clickHandler}
          title={title}
        >
          {isIconOnStart && (
            <Icon aphroditeStyles={s.icon}>{icon ?? iconLeft}</Icon>
          )}
          <span className={css(s.content, ...contentStyles)}>{children}</span>
          {isIconOnEnd && (
            <Icon aphroditeStyles={s.icon}>{icon ?? iconRight}</Icon>
          )}
        </a>
      </div>
    );
  }

  return (
    <div className={css(s.wrapper, s[animationDirection], wide && s._wide)}>
      <button
        className={css(s.base, s.button, ...buttonStyles)}
        disabled={disabled}
        type={type}
        onClick={clickHandler}
        title={title}
      >
        {isIconOnStart && (
          <Icon aphroditeStyles={s.icon}>{icon ?? iconLeft}</Icon>
        )}
        {children && (
          <Block
            padding={[
              0,
              icon || !isIconOnEnd ? 4 : 0,
              0,
              icon || !isIconOnStart ? 4 : 0,
            ]}
          >
            <Text
              type={smallLabel ? "body12" : "body13"}
              styles={[s.content, ...contentStyles]}
            >
              {children}
            </Text>
          </Block>
        )}
        {isIconOnEnd && (
          <Icon aphroditeStyles={s.icon}>{icon ?? iconRight}</Icon>
        )}
      </button>
    </div>
  );
});
Button.displayName = "Button";

export const styles = createStyles((theme) => ({
  wrapper: {
    "--button-icon-color": colors.white,
    "--button-content-opacity": "0",
    "--button-icon-opacity": "0.7",
    "--button-with-hidden-content-size": 32,

    display: "inline-flex",
  },
  toStart: {
    justifyContent: "flex-end",
  },
  toEnd: {
    justifyContent: "flex-start",
  },

  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    boxSizing: "border-box",
    borderRadius: 6,
    transition: `color ${durations.short}ms ease, background-color ${durations.short}ms ease, box-shadow ${durations.short}ms ease`,

    "&:hover, &:focus": {
      "--button-icon-opacity": "1",
    },
    "&:focus": {
      outline: "none",
    },
    "&:disabled, &:disabled:hover": {
      "--button-icon-color": colors.gray_e6e6e6,

      color: colors.gray_c6c6c6,
      backgroundColor: "transparent",
      boxShadow: shadows.innerBorderBase,
      cursor: "default",
    },
  },
  button: {
    cursor: "pointer",
    border: 0,
  },
  link: {
    textDecoration: "none",
  },
  _wide: {
    display: "flex",
    width: "100%",
  },
  _compact: {
    "--button-with-hidden-content-size": 24,

    padding: 0,
  },
  _fat: {
    "--button-with-hidden-content-size": 40,

    padding: 8,
  },
  _round: {
    borderRadius: 100,
  },
  _primary: {
    "--button-icon-color": colors.white,

    color: colors.white,
    backgroundColor: theme.colors.primary.main,

    "&:hover, &:focus": {
      backgroundColor: theme.colors.primary.light_1,
    },
  },
  _secondary: {
    "--button-icon-color": colors.gray_929292,

    color: colors.gray_262626,
    backgroundColor: colors.gray_f2f2f2,

    "&:hover, &:focus": {
      "--button-icon-color": colors.gray_262626,

      backgroundColor: colors.gray_e6e6e6,
    },
  },
  _tertiary: {
    "--button-icon-color": colors.gray_929292,

    color: colors.gray_262626,
    backgroundColor: colors.white,
    boxShadow: shadows.innerBorderBase,

    "&:hover, &:focus": {
      "--button-icon-color": colors.gray_262626,

      boxShadow: shadows.innerBorder(theme.colors.primary.light_2),
    },
  },
  _hiddenContentButton: {
    maxWidth: "var(--button-with-hidden-content-size)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: `max-width ${durations.medium}ms ease-in`,

    "&:hover, &:focus": {
      "--button-content-opacity": "1",

      /**
       * Чтобы анимация работала нужно конкретное число к которому нужно анимироваться.
       * Тут выбрана ширина фрейма, т.к. кнопка быть шире фрейма точно не может,
       * но можно и любое другое число
       */
      maxWidth: size.standardFrameWidth,
      transition: `max-width ${durations.medium}ms ease-out`,
    },
  },
  _justifyStart: {
    justifyContent: "flex-start",
  },
  _justifyEnd: {
    justifyContent: "flex-end",
  },

  icon: {
    display: "flex",
    alignItems: "center",
    color: "var(--button-icon-color)",
    transition: `color ${durations.short}ms ease, opacity ${durations.short}ms ease`,
    opacity: "var(--button-icon-opacity)",
  },

  content: {
    paddingInlineStart: 4,
    paddingInlineEnd: 4,
    color: "inherit",

    ":empty": {
      display: "none",
    },
  },
  _iconOnStart: {
    paddingInlineStart: 4,
  },
  _iconOnEnd: {
    paddingInlineEnd: 4,
  },
  _hiddenContent: {
    opacity: "var(--button-content-opacity)",
    transition: `opacity ${durations.medium}ms ease-in-out`,
  },
  _inlinePaddingStart: {
    paddingInlineStart: 4,
  },
  _inlinePaddingEnd: {
    paddingInlineEnd: 4,
  },
}));
