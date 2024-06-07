import React, { memo, useEffect, useMemo, useRef, useState } from "react";

import { createStyles, useStyles } from "../../hooks/useStyles";
import { clamp } from "../../utils/clamp";
import { getDecimalPrecision } from "../../utils/getDecimalPrecision";

import { durations } from "../animations";
import { colors } from "../colors";
import { borderRadius } from "../layout";
import { getRTLCSSValue } from "../rtl";

import {
  checkIfDotIsActive,
  getPosition,
  handleKeyPress,
  positionToValue,
  valueToPosition,
} from "./utils";

export type RangeType = { min: number; max: number };

type BaseProps = {
  /**
   * Минимальное значение слайдера.
   *
   * default — `0`
   */
  min?: number;
  /**
   * Максимальное значение слайдера.
   *
   * default — `100`
   */
  max?: number;
  /**
   * На какое значение за один шаг передвинется ползунок.
   *
   * default — `1`
   */
  step?: number;
  /**
   * Есть ли на слайдере точки?
   *
   * Для того чтобы точки отобразились должны быть соблюдены такие условия:
   * - `hasDots` === `true`.
   * - Целое количество точек.
   * - Количество точек >= `2` и <= `10`
   *
   * default — `false`
   */
  hasDots?: boolean;
  /** Компонент активен, его значение изменилось с дефолтного.
   *
   * @example
   * - В случае с фильтрами, когда пользователь поменял значение фильтра, он будет видеть, что этот фильтра активен, он его изменил.
   */
  isActive?: boolean;
  /** Компонент выключен? */
  disabled?: boolean;
  /**
   * Флаг форсирующий изменение стилей, как при ховере слайдера.
   *
   * default — `false`
   *
   * @example
   * В каких кейсах флаг поможет:
   * - Мы наводим на родителя слайдера и нам при этом нужно изменять стили, как при реальном ховере на слайдер.
   * - Мы зафокусились внутри родительского компонента и нам нужно поменять стили слайдера, как при ховере.
   */
  hovered?: boolean;
  /** Срабатывает при снятии фокуса с ползунка */
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
};

export type SliderProps = {
  /** Значение слайдера.*/
  value: number;
  /** Слайдер (1 ползунок)*/
  type: "slider";
  /** Срабатывает при каждом изменении позиции ползунка */
  onChange: (value: number) => void;
  /** Срабатывает при изменении позиции ползунка */
  onMouseMove: (value: number) => void;
  /** Вызывается при управлении ползунками с помощью клавиатуры */
  onKeyDown?: (value: number) => void;
} & BaseProps;

export type RangeProps = {
  /** Значение слайдера */
  value: RangeType;
  /** Диапазон (2 ползунка)*/
  type: "range";
  /** Срабатывает при каждом изменении позиции ползунка */
  onChange: (value: RangeType) => void;
  /** Срабатывает при изменении позиции ползунка */
  onMouseMove: (value: RangeType) => void;
  /** Вызывается при управлении ползунками с помощью клавиатуры */
  onKeyDown?: (value: RangeType) => void;
} & BaseProps;

export type Props = SliderProps | RangeProps;

/** Слайдер */
export const Slider = memo<Props>((props) => {
  const {
    type,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    hovered = false,
    isActive = false,
  } = props;
  const { css, s } = useStyles(styles);
  //   const { dir } = useTheme();
  const dir = "ltr";

  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbMinRef = useRef<HTMLDivElement>(null);
  const thumbMaxRef = useRef<HTMLDivElement>(null);

  // Позиция ползунка слайдера от 0 до 100
  const [position, setPosition] = useState<number | RangeType>(
    valueToPosition(props.value, min, max),
  );
  /**
   * При перемещении ползунка `position` не обновляется пока не отпустим клавишу мыши,
   * поэтому в `updatePosition` используем `positionRef`
   */
  const positionRef = useRef(position);

  // Текущий активный ползунок
  const activeThumbRef = useRef<HTMLDivElement | null>(null);

  // Так мы определяем сколько ползунков у слайдера. Если объект, то 2 ползунка.
  const isRange = typeof position === "object";

  /** Сколько процентов слайдера проходим за 1 шаг */
  const oneStep = (step / (max - min)) * 100;

  /**
   * Выводим точки, только если:
   * - `hasDots` === `true`.
   * - Целое количество точек.
   * - Количество точек >= `2` и <= `10`
   */
  const numberOfDots = useMemo(() => {
    const numberOfSteps = (max - min) / step + 1;
    const hasDots =
      props.hasDots &&
      Number.isInteger(numberOfSteps) &&
      numberOfSteps <= 10 &&
      numberOfSteps >= 2;

    return hasDots ? Math.round(numberOfSteps) : 0;
  }, [max, min, props.hasDots, step]);

  /** Количество символов после запятой */
  const precision = useMemo(() => getDecimalPrecision(step), [step]);

  /** Обновить позицию ползунка слайдера */
  function updatePosition(event: MouseEvent | TouchEvent) {
    if (!sliderRef.current) return;

    const thumbPosition = getPosition({
      el: sliderRef.current,
      event,
      dir,
      oneStep,
    });

    if (typeof positionRef.current === "object") {
      const minDelta = thumbPosition - positionRef.current.min;
      const maxDelta = thumbPosition - positionRef.current.max;
      let thumb;
      const activeThumb = activeThumbRef.current?.dataset["sliderThumb"] as
        | "min"
        | "max"
        | undefined;

      if (minDelta === maxDelta) {
        // Ползунки в крайней минимальной/максимальной точке
        thumb = minDelta <= 0 ? "min" : "max";
      } else if (Math.abs(minDelta) === Math.abs(maxDelta)) {
        // Искомая точка находится между двумя ползунками на равном расстоянии от них
        thumb = maxDelta < 0 && activeThumb === "max" ? "max" : "min";
      } else {
        thumb = Math.abs(minDelta) < Math.abs(maxDelta) ? "min" : "max";
      }

      const pos = {
        ...positionRef.current,
        [thumb]: thumbPosition,
      };

      setPosition(pos);
      positionRef.current = pos;

      // Задаём активный ползунок, чтобы потом повесить на него фокус
      if (!activeThumbRef.current) {
        activeThumbRef.current =
          thumb === "min" ? thumbMinRef.current : thumbMaxRef.current;
      }

      return pos;
    }

    setPosition(thumbPosition);
    positionRef.current = thumbPosition;

    // Задаём активный ползунок, чтобы потом повесить на него фокус
    activeThumbRef.current = thumbMinRef.current;

    return thumbPosition;
  }

  function updateValue(event: MouseEvent | TouchEvent) {
    const newPosition = updatePosition(event);

    if (newPosition === undefined) {
      return;
    }

    if (type === "slider" && typeof newPosition === "number") {
      props.onChange(positionToValue(newPosition, min, max, precision));
    } else if (type === "range" && typeof newPosition === "object") {
      props.onChange({
        min: positionToValue(newPosition.min, min, max, precision),
        max: positionToValue(newPosition.max, min, max, precision),
      });
    }
  }

  /** Обработчик нажатия кнопки мыши */
  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(event as any);

    window.document.addEventListener("mouseup", handleUp);
    window.document.addEventListener("touchend", handleUp);
    window.document.addEventListener("mousemove", handleMove);
    window.document.addEventListener("touchmove", handleMove);
  };

  /** Обработчик изменения положения ползунка */
  function handleMove(event: MouseEvent | TouchEvent) {
    const newPosition = updatePosition(event);
    if (newPosition === undefined) {
      return;
    }

    if (type === "slider" && typeof newPosition === "number") {
      props.onMouseMove(positionToValue(newPosition, min, max, precision));
    } else if (type === "range" && typeof newPosition === "object") {
      props.onMouseMove({
        min: positionToValue(newPosition.min, min, max, precision),
        max: positionToValue(newPosition.max, min, max, precision),
      });
    }
  }

  /** Обработчик отжатия клавиши мыши */
  function handleUp(e: MouseEvent | TouchEvent) {
    window.document.removeEventListener("mouseup", handleUp);
    window.document.removeEventListener("touchend", handleUp);
    window.document.removeEventListener("mousemove", handleMove);
    window.document.removeEventListener("touchmove", handleMove);

    updateValue(e);

    if (activeThumbRef.current) {
      activeThumbRef.current.focus();
    }
  }

  /**
   * Обработчик нажатий клавиш на клавиатуре.
   * Управление ползунком с помощью клавиатуры
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!disabled) {
      const value =
        typeof props.value === "object"
          ? {
              min: props.value?.min ?? min,
              max: props.value?.max ?? max,
            }
          : props.value ?? min;

      const newValue = handleKeyPress({
        value,
        event,
        dir,
        step,
        min,
        max,
        precision,
        thumbMinRef,
        thumbMaxRef,
        activeThumbRef,
      });

      if (newValue === undefined) {
        return;
      }

      const newPosition = valueToPosition(newValue, min, max);

      const isRange =
        type === "range" &&
        typeof newPosition === "object" &&
        typeof value === "object";

      /**
       * В случае если оба ползунка находятся в минимальной точке вешаем фокус на максимальный ползунок
       * В случае если оба ползунка находятся в максимальной точке вешаем фокус на минимальный ползунок
       * Это нужно для того чтобы не было ситуации, что ползунки не перемещаются из-за постоянного clapm'а значения
       */
      if (isRange && value.min === min && value.max === min) {
        activeThumbRef.current = thumbMaxRef.current;
      } else if (isRange && value.min === max && value.max === max) {
        activeThumbRef.current = thumbMinRef.current;
      }

      activeThumbRef.current?.focus();

      setPosition(newPosition);
      positionRef.current = newPosition;

      if (!props.onKeyDown) {
        return;
      }

      if (type === "slider" && typeof newPosition === "number") {
        props.onKeyDown(positionToValue(newPosition, min, max, precision));
      } else if (isRange) {
        props.onKeyDown({
          min: positionToValue(newPosition.min, min, max, precision),
          max: positionToValue(newPosition.max, min, max, precision),
        });
      }
    }
  };

  const onThumbBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    activeThumbRef.current = null;

    if (props.onBlur) {
      props.onBlur(event);
    }
  };
  const onThumbFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    activeThumbRef.current = event.target;
  };

  /**
   * Обрабатываем обновление значения, которое прилетело снаружи в компонент
   */
  useEffect(() => {
    let newPosition = valueToPosition(props.value, min, max);

    // Обрабатываем ситуацию когда извне пришли аномально большие/маленькие значения
    if (typeof newPosition === "object") {
      newPosition = {
        min: clamp(newPosition.min, 0, 100),
        max: clamp(newPosition.max, 0, 100),
      };
    } else {
      newPosition = clamp(newPosition, 0, 100);
    }

    setPosition(newPosition);
    positionRef.current = newPosition;
  }, [max, min, props.value]);

  return (
    <div
      ref={sliderRef}
      className={css(
        s.slider,
        hovered && s._hovered,
        isActive && s._active,
        disabled && s._disabled,
      )}
      onMouseDown={!disabled ? onMouseDown : undefined}
    >
      {/* Точки */}
      {[...Array(numberOfDots)].map((_, index) => (
        <span
          key={index}
          className={css(
            s.dot,
            checkIfDotIsActive({
              thumbPosition: position,
              index,
              oneStep,
              disabled,
            }) && s._activeDot,
          )}
          style={{ insetInlineStart: `${index * oneStep}%` }}
        ></span>
      ))}

      {/* Фоновый трек */}
      <div className={css(s.track)} />

      {/* Трек показывающий значением слайдера */}
      <div
        className={css(s.valueTrack)}
        style={{
          insetInlineStart: `${isRange ? position?.min || 0 : 0}%`,
          insetInlineEnd: `${isRange ? 100 - (position.max || 0) : 100 - position}%`,
        }}
      />

      {/* Ползунок минимального значения */}
      {!disabled && isRange && (
        <div
          ref={thumbMinRef}
          tabIndex={0}
          className={css(s.thumb)}
          style={{ insetInlineStart: `${isRange ? position.min : position}%` }}
          onBlur={onThumbBlur}
          onKeyDown={props.onKeyDown ? onKeyDown : undefined}
          onFocus={onThumbFocus}
          data-slider-thumb="min"
        />
      )}

      {/* Ползунок максимального значения */}
      {!disabled && (
        <div
          ref={thumbMaxRef}
          tabIndex={0}
          className={css(s.thumb)}
          style={{ insetInlineStart: `${isRange ? position.max : position}%` }}
          onBlur={onThumbBlur}
          onKeyDown={onKeyDown}
          onFocus={onThumbFocus}
          data-slider-thumb="max"
        />
      )}
    </div>
  );
});
Slider.displayName = "Slider";

export const styles = createStyles((theme) => ({
  slider: {
    "--slider-thumb-color": colors.gray_c6c6c6,
    "--slider-value-track-color": colors.gray_c6c6c6,
    "--slider-dot-color": colors.gray_e6e6e6,

    position: "relative",
    height: 16,
    cursor: "pointer",

    "&:hover, &:focus-within": {
      "--slider-value-track-color": theme.colors.primary.light_2,
    },
  },
  _hovered: {
    "--slider-value-track-color": theme.colors.primary.light_2,
  },
  _active: {
    "--slider-thumb-color": theme.colors.primary.main,
    "--slider-value-track-color": theme.colors.primary.main,

    "&:hover, &:focus-within": {
      "--slider-value-track-color": theme.colors.primary.main,
    },
  },
  _disabled: {
    "--slider-value-track-color": "transparent",
    "--slider-dot-color": colors.gray_c6c6c6,
    cursor: "default",

    "&:hover": {
      "--slider-value-track-color": "transparent",
      "--slider-dot-color": colors.gray_c6c6c6,
    },
  },

  track: {
    position: "absolute",
    top: "50%",
    insetInline: 0,
    transform: "translateY(-50%)",
    width: "100%",
    height: 4,
    background: colors.gray_e6e6e6,
    borderRadius: "100px",
  },

  valueTrack: {
    position: "absolute",
    top: "50%",
    insetInlineStart: 0,
    transform: "translateY(-50%)",
    height: 4,
    background: "var(--slider-value-track-color)",
    borderRadius: "100px",
    transition: `background-color ${durations.short}ms ease`,
  },

  thumb: {
    willChange: "inset-inline",
    position: "absolute",
    width: 16,
    height: 16,
    top: "50%",
    transform: `translate(${getRTLCSSValue({
      dir: theme.dir,
      ltrValue: "-8px",
    })}, -50%)`,
    background: colors.white,
    borderRadius: borderRadius.rounded,
    transition: `box-shadow ${durations.short}ms ease`,
    boxShadow: "0 0 0 2px var(--slider-thumb-color) inset",
    outline: 0,

    "&:hover, &:focus": {
      "--slider-thumb-color": theme.colors.primary.light_2,
    },
  },

  dot: {
    position: "absolute",
    top: "50%",
    transform: `translate(${getRTLCSSValue({
      dir: theme.dir,
      ltrValue: "-4px",
    })}, -50%)`,
    width: 8,
    height: 8,
    borderRadius: borderRadius.circle,
    backgroundColor: "var(--slider-dot-color)",
  },
  _activeDot: {
    backgroundColor: "var(--slider-value-track-color)",
    transition: `background-color ${durations.short}ms ease`,
  },
}));
