import { useStyles } from "../../hooks/useStyles";
import { clamp } from "../../utils/clamp";
import { Direction } from "../../types";

import { RangeType, styles } from ".";

function valueToPercent(value: number, min: number, max: number) {
  return ((value - min) * 100) / (max - min);
}

export function valueToPosition(
  value: number | RangeType,
  min: number,
  max: number,
): number | RangeType {
  if (typeof value === "object") {
    return {
      min: value.min !== undefined ? valueToPercent(value.min, min, max) : 0,
      max: value.max !== undefined ? valueToPercent(value.max, min, max) : 100,
    };
  }

  return valueToPercent(value, min, max);
}

export function positionToValue(
  position: number,
  min: number,
  max: number,
  precision: number,
) {
  const val = min + ((max - min) * position) / 100;
  const num = Math.pow(10, precision);
  // округляем до нужного количества знаков
  return Math.round(val * num) / num;
}

export function useSliderStyles({
  disabled,
  hovered,
}: {
  disabled: boolean;
  hovered: boolean;
}) {
  const { s } = useStyles(styles);

  const mutableStyles = [s.slider];

  if (disabled) {
    mutableStyles.push(s._disabled);
    return mutableStyles;
  }

  if (hovered) {
    mutableStyles.push(s._hovered);
  }

  return mutableStyles;
}

/**
 * Обрабатывает нажатия клавиш на клавиатуре и вычисляем
 * на какое значение сдвинуть ползунок слайдера.
 */
export function handleKeyPress(params: {
  event: React.KeyboardEvent<HTMLDivElement>;
  value: number | { min: number; max: number };
  dir: Direction;
  min: number;
  max: number;
  step: number;
  precision: number;
  thumbMinRef: React.RefObject<HTMLDivElement>;
  thumbMaxRef: React.RefObject<HTMLDivElement>;
  activeThumbRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const {
    event,
    value,
    step,
    min,
    max,
    dir,
    precision,
    thumbMinRef,
    thumbMaxRef,
    activeThumbRef,
  } = params;

  const isRange = typeof value === "object";

  // Приводим типы осознанно, т.к. знаем что в `dataset` могут быть `min` или `max`
  const activeThumb = event.currentTarget.dataset["sliderThumb"] as
    | "min"
    | "max";

  // Если нужного атрибута нет ничего не делаем
  if (!activeThumb) {
    return;
  }

  const passiveThumb =
    isRange && activeThumb === "min" ? ("max" as const) : ("min" as const);
  const oldActiveThumbValue = isRange
    ? Number(value[activeThumb])
    : Number(value);

  // Отключаем дефолтное поведение этих клавиш
  switch (event.key) {
    case "End":
    case "Home":
    case "PageUp":
    case "PageDown":
      event.preventDefault();
  }

  let newThumbValue: number;
  switch (event.key) {
    case "Left":
    case "ArrowLeft":
      newThumbValue =
        dir === "rtl" ? oldActiveThumbValue + step : oldActiveThumbValue - step;
      break;

    // Для rtl уменьшаем, для ltr увеличиваем значение слайдера на 1 шаг
    case "Right":
    case "ArrowRight":
      newThumbValue =
        dir === "rtl" ? oldActiveThumbValue - step : oldActiveThumbValue + step;
      break;

    // Увеличиваем значение слайдера на 1 шаг
    case "Up":
    case "PageUp":
    case "ArrowUp":
      newThumbValue = oldActiveThumbValue + step;
      break;

    // Уменьшаем значение слайдера на 1 шаг
    case "Down":
    case "PageDown":
    case "ArrowDown":
      newThumbValue = oldActiveThumbValue - step;
      break;

    // Уменьшаем значение слайдера до минимального
    case "Home":
      newThumbValue = min;
      break;

    // Увеличиваем значение слайдера до максимального
    case "End":
      newThumbValue = max;
      break;

    default:
      return undefined;
  }

  let activeThumbValue = Number(
    clamp(newThumbValue, min, max).toFixed(precision),
  );
  let passiveThumbValue = isRange ? Number(value[passiveThumb]) : undefined;
  if (
    isRange &&
    passiveThumbValue &&
    ((activeThumb === "min" && activeThumbValue > value.max) ||
      (activeThumb === "max" && activeThumbValue < value.min))
  ) {
    activeThumbRef.current =
      activeThumb === "min" ? thumbMaxRef.current : thumbMinRef.current;
    activeThumbRef.current?.focus();

    [passiveThumbValue, activeThumbValue] = [
      activeThumbValue,
      passiveThumbValue,
    ];
  }

  return isRange
    ? {
        min:
          activeThumb === "min"
            ? activeThumbValue
            : (passiveThumbValue as number),
        max:
          activeThumb === "max"
            ? activeThumbValue
            : (passiveThumbValue as number),
      }
    : activeThumbValue;
}

/**
 * Возвращает позицию (в %) в которую должен передвинуться ползунок при клике в слайдер
 */
export function getPosition(params: {
  el: HTMLDivElement;
  dir: Direction;
  event: MouseEvent | TouchEvent;
  /** Сколько `%` ползунок проходит за 1 ход */
  oneStep: number;
}) {
  const { el, dir, event, oneStep } = params;

  const rect = el.getBoundingClientRect();
  const clientX =
    "changedTouches" in event
      ? event.changedTouches[0]!.clientX
      : event.clientX;

  const xCoord = dir === "rtl" ? rect.right - clientX : clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, xCoord / rect.width));
  const newPosition = ratio * 100;

  const currentStep = newPosition / oneStep;
  const lowEnd = Math.floor(currentStep) * oneStep;
  const highEnd = Math.ceil(currentStep) * oneStep;

  // Ищем ближайшее значение с целым количеством шагов к тому что посчитали выше
  return clamp(
    newPosition - lowEnd < highEnd - newPosition ? lowEnd : highEnd,
    0,
    100,
  );
}

export function checkIfDotIsActive(params: {
  thumbPosition: number | { min: number; max: number };
  index: number;
  oneStep: number;
  disabled: boolean;
}) {
  const { thumbPosition, index, oneStep, disabled } = params;

  if (disabled) {
    return false;
  }

  const dotPosition = index * oneStep;

  if (typeof thumbPosition === "object") {
    return dotPosition >= thumbPosition.min && dotPosition <= thumbPosition.max;
  }

  return dotPosition <= thumbPosition;
}
