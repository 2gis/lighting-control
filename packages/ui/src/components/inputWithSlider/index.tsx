import React, {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { clamp } from "../../utils/clamp";
import { getDecimalPrecision } from "../../utils/getDecimalPrecision";
import { createStyles, useStyles } from "../../hooks/useStyles";

import { durations } from "../animations";
import { colors } from "../colors";
import { Slider } from "../slider";
import { regular } from "../typography";
import { shadows } from "../shadows";

import {
  formatterDefault,
  formatterParams,
  parserDefault,
  parserParams,
} from "./defaults";
import { getInputWidth } from "./utils";

export interface Props {
  /** Значение слайдера */
  value: number;
  /** Минимальное значение слайдера */
  min: number;
  /** Максимальное значение слайдера */
  max: number;
  /** Стиль слайдера как при наведении*/
  hovered?: boolean;
  /**
   * Является ли компонент активным?
   *
   * @example
   * - В фильтрах после изменения дефолтного значения, фильтр становится активным.
   */
  isActive?: boolean;
  /** На какое значение за один шаг передвинется ползунок */
  step?: number;
  /** Единица измерения (%, km и т.п.) */
  unit?: string;
  /** Есть ли на слайдере точки? */
  hasDots?: boolean;
  /** Компонент задизейблен? */
  disabled?: boolean;
  /** Вызывается при изменении значения */
  onChange: (value: number) => void;
  /** Приводит значение к формату подходящему для инпута */
  formatter?: (params: formatterParams) => string;
  /** Приводит значение к формату необходимому для использования снаружи компонента */
  parser?: (params: parserParams) => number;
  inputNode?: ReactNode;
}

/**
 * Инпут со слайдером
 */
export const InputWithSlider = memo<Props>((props) => {
  const {
    min,
    max,
    step = 1,
    unit,
    hasDots = false,
    disabled = false,
    isActive = false,
    onChange,
    formatter = formatterDefault,
    parser = parserDefault,
    inputNode,
  } = props;
  const { css, s } = useStyles(styles);

  const precision = useMemo(() => getDecimalPrecision(step), [step]);
  const inputMin = useMemo(
    () => Number(formatter({ value: min, precision })),
    [formatter, min, precision],
  );
  const inputMax = useMemo(
    () => Number(formatter({ value: max, precision })),
    [formatter, max, precision],
  );
  const inputStep = useMemo(
    () => Number(formatter({ value: step, precision })),
    [formatter, step, precision],
  );

  const [inputValue, setInputValue] = useState(() => {
    return formatter({
      value: clamp(Number(props.value), min, max),
      precision,
    });
  });

  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  const sliderChangeHandler = useCallback(
    (value: number) => {
      setInputValue(formatter({ value, precision }));
      onChange(value);
    },
    [formatter, onChange, precision],
  );

  const onMouseMove = useCallback(
    (value: number) => setInputValue(formatter({ value, precision })),
    [formatter, precision],
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.currentTarget.value.trim();

      // Нет смысла вызывать `onChange`, когда в `value` пустая строка
      if (rawValue === "") {
        setInputValue("");
        return;
      }

      setInputValue(rawValue);
    },
    [],
  );

  const inputBlurHandler = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setFocusWithin(false);

      const parsedValue = parser({
        value: event.currentTarget.value.trim(),
        precision,
      });
      const newValue = clamp(Number(parsedValue) || min, min, max);
      setInputValue(formatter({ value: newValue, precision }));
      onChange(newValue);
    },
    [formatter, max, min, onChange, parser, precision],
  );

  const inputKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        const parsedValue = parser({
          value: event.currentTarget.value.trim(),
          precision,
        });
        const newValue = clamp(Number(parsedValue) || min, min, max);
        setInputValue(formatter({ value: newValue, precision }));
        onChange(newValue);
      }
    },
    [max, min, precision, onChange, parser, formatter],
  );

  // Обрабатываем значение, которое прилетело снаружи
  useEffect(() => {
    const value = Number(props.value);

    const newValue = !Number.isFinite(value)
      ? ""
      : formatter({ value: clamp(value, min, max), precision });
    setInputValue(newValue);
  }, [props.value, precision, formatter, min, max]);

  return (
    <div
      className={css(s.root, isActive && s._active, disabled && s._disabled)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <label className={css(s.label, disabled && s._disabledLabel)}>
        {inputNode ?? (
          <bdi>
            <input
              type="number"
              className={css(s.input)}
              value={inputValue}
              min={inputMin}
              max={inputMax}
              step={inputStep}
              disabled={disabled}
              onChange={onInputChange}
              onFocus={() => setFocusWithin(true)}
              onBlur={inputBlurHandler}
              onKeyDown={inputKeyDownHandler}
              style={{ width: getInputWidth(inputValue) }}
            />
            {!!unit && <span>{unit}</span>}
          </bdi>
        )}
      </label>

      <Slider
        value={parser({ value: inputValue, precision })}
        min={min}
        max={max}
        step={step}
        type="slider"
        hasDots={hasDots}
        hovered={props.hovered || hovered || focusWithin}
        disabled={disabled}
        onChange={sliderChangeHandler}
        onKeyDown={sliderChangeHandler}
        onMouseMove={onMouseMove}
        isActive={isActive}
      />
    </div>
  );
});
InputWithSlider.displayName = "InputWithSlider";

export const styles = createStyles((theme) => ({
  root: {
    "--input-with-slider-text-color": colors.gray_262626,
    "--input-with-slider-shadow-color": colors.gray_e6e6e6,

    borderRadius: 16,
    paddingInline: 12,
    paddingBottom: 6,
    boxShadow: shadows.innerBorder("var(--input-with-slider-shadow-color)"),
    transition: `border-color ${durations.short}ms ease`,
    cursor: "pointer",
    userSelect: "none",
    backgroundColor: colors.white,

    "&:hover, &:focus-within": {
      "--input-with-slider-shadow-color": theme.colors.primary.light_2,
    },
  },
  _active: {
    "--input-with-slider-shadow-color": theme.colors.primary.main,
  },
  _disabled: {
    "--input-with-slider-shadow-color": colors.gray_e6e6e6,
    cursor: "default",

    "&:hover": {
      "--input-with-slider-shadow-color": colors.gray_e6e6e6,
    },
  },

  label: {
    ...regular,
    display: "flex",
    alignItems: "center",
    height: 32,
    cursor: "text",
    color: "var(--input-with-slider-text-color)",
  },
  _disabledLabel: {
    cursor: "default",
    "--input-with-slider-text-color": colors.gray_c6c6c6,
  },

  input: {
    padding: 0,
    border: 0,
    outline: 0,
    backgroundColor: "transparent",
    color: "var(--input-with-slider-text-color)",

    "&:disabled": {
      "--input-with-slider-text-color": colors.gray_c6c6c6,
      /** @see https://stackoverflow.com/questions/262158/disabled-input-text-color-on-ios */
      "-webkit-text-fill-color": "var(--input-with-slider-text-color)",
    },
  },
}));
