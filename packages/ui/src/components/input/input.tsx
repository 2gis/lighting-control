import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

import { createStyles, useStyles } from "../../hooks/useStyles";
import { useTranslation } from "../../hooks/useTranslation";

import { Icon } from "../icon";
import { colors } from "../colors";
import { durations } from "../animations";
import { captionRegular11x12 } from "../typography";
import { Fade } from "../fade";
import { InputVariant } from "../elementThemes";

import { BaseInput } from "./base";
import { InputType } from "./types";

export type Props = {
  /**
   * Значение поля
   *
   * Если поле `uncontrolled`, то `value` игнорируется.
   */
  value?: string;
  /**
   * Тип поля
   *
   * Тип влияет:
   * - на то какое значение можно ввести в поле;
   * - как будет валидироваться значение.
   *
   * `type="number"` в компоненте преобразуется в `type="text"`.
   * Это нам позволяет получать введено в поле значение,
   * без внутренних браузерных обработок.
   *
   * default — `text`
   */
  type?: InputType;

  /**
   * Вариант поля
   *
   * Вариант влияет на цвет фона и цвет градиента поля.
   *
   * default — `filled`, это серый цвет
   */
  variant?: InputVariant;

  /** Лейбл для поля */
  label?: string;
  /** Описание для поля */
  caption?: string;
  /** Текст ошибки. Если передан true - отобразится только красная обводка у поля. */
  error?: string | boolean;

  /** Иконка в начале поля */
  iconStart?: React.ReactNode;
  /** Функция, которая выполняется при клике на иконку в начале поля */
  iconStartOnClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /**
   * Контент в начале поля, сразу за иконкой
   */
  contentStart?: (params: {
    hovered?: boolean;
    focused?: boolean;
  }) => React.ReactNode;
  /** Иконка в конце поля */
  iconEnd?: React.ReactNode;
  /** Функция которая выполняется при клике на иконку в конце поля */
  iconEndOnClick?: () => void;
  /** Функция которая выполняется при нажатии на клавишу мыши на иконку в конце поля */
  iconEndOnMouseDown?: () => void;

  /**
   * Лейбл поля для скринридера
   *
   * Можно не указывать если задан `label`.
   */
  ariaLabel?: string;
  /** Плейсхолдер для поля */
  placeholder?: string;
  /**
   * Определяет может ли браузер предлагать автозаполнение поля
   * и какие данные браузер будет предлагать для автозаполнения.
   *
   * default — `off`
   */
  autoComplete?: string;
  /**
   * Определяет зафокусится ли поле автоматически при появлении на странице
   *
   * default — `false`
   */
  autoFocus?: boolean;
  /**
   * Ссылка на поле
   */
  inputRef?: React.Ref<HTMLInputElement>;

  /**
   * `id` для поля
   *
   * Необходимо если мы хотим связать `<label>` с `<input>`, чтобы при клике в `<label>` фокус перемещался на `<input>`.
   */
  id?: string;
  /** Имя поля, которое будет использоваться при отправке формы */
  name?: string;
  /** `id` формы с которой нужно связать поле */
  form?: string;
  /**
   * Определяет может ли изменение `props.value` снаружи влиять на значение в поле.
   *
   * - `controlled` === `true` — изменение `props.value` может влиять на значение в поле.
   * - `controlled` === `false` — изменение `props.value` не будет влиять на значение в поле.
   *    Изначальное значение поля (`defaultValue`) будет `props.value`.
   *
   * default — `true`
   */
  controlled?: boolean;

  /**
   * Ширина поля
   *
   * @example
   * Примеры использования:
   * - Ширина поля меняется во время набора значения.
   */
  width?: number | string;
  /** Минимальное количество символов, которое можно ввести в поле */
  minLength?: number;
  /** Максимальное количество символов, которое можно ввести в поле */
  maxLength?: number;

  /** Поле выключено? */
  disabled?: boolean;
  /** Поле обязательное для ввода? */
  required?: boolean;
  /** Поле только для чтения?
   *
   * В поле нельзя вводить значение.
   *
   * Отличие от `disabled`:
   * - Поле отправляется при отправке формы.
   * - Поле можно зафокусить.
   */
  readOnly?: boolean;

  min?: string | number;
  max?: string | number;

  pattern?: string | undefined;

  /** Форматирует значение из поля в кастомный формат */
  formatter?: (value: string) => string;
  /** Форматирует значение из кастомного формата в формат, который подходит для поля */
  parser?: (value: string) => string;

  /** Функция вызывается при изменении значения поля */
  onChange?: (value: string) => void;
  /** Функция вызывается при нажатии на клавиши клавиатуры */
  onKeyDown?: (params: {
    event: React.KeyboardEvent<HTMLInputElement>;
    value: string;
  }) => void;
  /** Функция вызывается при снятии фокуса с поля */
  onBlur?: (params: {
    event: React.FocusEvent<HTMLInputElement>;
    value: string;
  }) => void;
  /** Функция вызывается при фокусе поля */
  onFocus?: (params: {
    event: React.FocusEvent<HTMLInputElement>;
    value: string;
  }) => void;

  showFadeOnEnd?: boolean;
};

/**
 * Стилизованное поле.
 *
 * TODO_INPUT:
 * - Понять нужен ли текст `required` в поле. Если нужен, уточнить какой текст должен быть.
 * - Разобраться с ошибки. Ошибка приходит из вне или изнутри в результате валидации из поля?
 *
 * TODO:
 * - Сделать состояние фокуса (проверить есть ли в дизайнах)
 */
export const Input = memo<Props>((props) => {
  const {
    type = "text",
    variant = "filled",
    label,
    error,
    caption,
    iconStart,
    iconStartOnClick,
    contentStart,
    iconEnd,
    iconEndOnClick,
    iconEndOnMouseDown,
    name,
    inputRef,
    controlled = true,
    disabled,
    required,
    onChange,
    onBlur,
    onFocus,
    showFadeOnEnd = true,
    min,
    max,
  } = props;

  const { css, s } = useStyles(styles);
  const { _t } = useTranslation();

  const [inputValue, setInputValue] = useState(props.value || "");
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  // TODO_INPUT: заменить на useId после обновления на React 18
  const id = useMemo(() => (props.id ? props.id : uuid()), [props.id]);

  const changeHandler = useCallback(
    (newValue: string) => {
      setInputValue(newValue);

      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange],
  );

  const focusHandler = useCallback(
    (params: { event: React.FocusEvent<HTMLInputElement>; value: string }) => {
      setFocused(true);

      if (onFocus) {
        onFocus(params);
      }
    },
    [onFocus],
  );

  const blurHandler = useCallback(
    (params: { event: React.FocusEvent<HTMLInputElement>; value: string }) => {
      setFocused(false);

      if (onBlur) {
        onBlur(params);
      }
    },
    [onBlur],
  );

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  useEffect(() => {
    if (controlled) {
      setInputValue(props.value || "");
    }
  }, [controlled, props.value]);

  return (
    <div
      className={css(
        s.root,
        variant === "filled" ? s._filled : s._standard,
        disabled && s._disabled,
      )}
    >
      {label && (
        <label htmlFor={id} className={css(s.label)}>
          {label}
        </label>
      )}
      <div
        className={css(
          s.inputWrapper,
          disabled && s._disabledInputWrapper,
          !!error && s._inputWrapperError,
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {iconStart && (
          <button
            className={css(
              s.button,
              s.iconWrapper,
              iconEndOnClick && s.endOnClick,
            )}
            onClick={iconStartOnClick}
          >
            <Icon aphroditeStyles={[s.icon, s.startIcon]}>{iconStart}</Icon>
          </button>
        )}

        {contentStart && (
          <div className={css(s.contentStartWrapper)}>
            {contentStart({
              focused,
              hovered,
            })}
          </div>
        )}

        <div className={css(s.inputContainer)}>
          <Fade
            position="end"
            size="16px"
            color={variant === "standard" ? colors.white : colors.gray_f2f2f2}
            hidden={!showFadeOnEnd || focused || disabled}
          >
            <BaseInput
              value={inputValue}
              type={type}
              className={s.input}
              placeholder={props.placeholder}
              ariaLabel={
                props.ariaLabel || label ? props.ariaLabel : props.placeholder
              }
              name={name}
              id={id}
              form={props.form}
              minLength={props.minLength}
              maxLength={props.maxLength}
              inputRef={inputRef}
              autoComplete={props.autoComplete}
              autoFocus={props.autoFocus}
              // TODO: Подумать действительно ли этот атрибут нужен
              required={required}
              disabled={disabled}
              readOnly={props.readOnly}
              formatter={props.formatter}
              parser={props.parser}
              onChange={changeHandler}
              onFocus={focusHandler}
              onKeyDown={props.onKeyDown}
              onBlur={blurHandler}
              min={min}
              max={max}
              pattern={props.pattern}
            />
          </Fade>
        </div>
        {required && inputValue.length === 0 && (
          <span className={css(s.required)}>{_t("Обязательно")}</span>
        )}
        {iconEnd && (
          <button
            className={css(
              s.button,
              s.iconWrapper,
              (iconEndOnClick || iconEndOnMouseDown) && s.endOnClick,
            )}
            onClick={iconEndOnClick}
            onMouseDown={iconEndOnMouseDown}
          >
            <Icon aphroditeStyles={[s.icon, s.endIcon]}>{iconEnd}</Icon>
          </button>
        )}
      </div>
      {typeof error === "string" && <p className={css(s.error)}>{error}</p>}
      {caption && <p className={css(s.caption)}>{caption}</p>}
    </div>
  );
});
Input.displayName = "Input";

const styles = createStyles((theme) => ({
  root: {
    "--input-wrapper-shadow-color": "transparent",
    "--input-start-button-icon-color": colors.gray_929292,
    "--input-end-button-icon-color": colors.gray_c6c6c6,
    "--input-label-color": colors.gray_929292,
    "--input-caption-color": colors.gray_929292,
    "--input-required-color": colors.gray_929292,
    "--input-error-color": colors.red_f5373c,
  },
  _disabled: {
    "--input-label-color": colors.black_02,
    "--input-caption-color": colors.black_02,
    "--input-error-color": colors.black_02,
  },
  _standard: {
    "--input-input-wrapper-background-color": colors.white,
  },
  _filled: {
    "--input-input-wrapper-background-color": colors.gray_f2f2f2,
  },

  label: {
    ...captionRegular11x12,
    display: "block",
    paddingTop: 5,
    paddingBottom: 7,
    color: "var(--input-label-color)",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    padding: 8,
    borderRadius: 8,
    boxShadow: "inset 0 0 0 1px var(--input-wrapper-shadow-color)",
    transition: `box-shadow ${durations.short}ms ease`,
    backgroundColor: "var(--input-input-wrapper-background-color)",

    "&:not(:last-child)": {
      marginBottom: 6,
    },

    "&:hover, &:focus-within": {
      "--input-wrapper-shadow-color": theme.colors.primary.light_2,
      "--input-start-button-icon-color": colors.gray_262626,
      "--input-end-button-icon-color": colors.gray_929292,
    },
  },
  _disabledInputWrapper: {
    "--input-wrapper-shadow-color": colors.black_01,
    "--input-start-button-icon-color": colors.black_01,
    "--input-end-button-icon-color": colors.black_01,
    "--input-input-wrapper-background-color": "transparent",

    "&:hover": {
      "--input-wrapper-shadow-color": colors.black_01,
      "--input-start-button-icon-color": colors.black_01,
      "--input-end-button-icon-color": colors.black_01,
    },
  },
  _inputWrapperError: {
    "--input-wrapper-shadow-color": colors.red_f5373c,
    boxShadow: "inset 0 0 0 2px var(--input-wrapper-shadow-color)",

    "&:hover, &:focus-within": {
      "--input-wrapper-shadow-color": colors.red_f5373c,
    },
  },

  inputContainer: {
    position: "relative",
    width: "100%",
  },
  _unfocusedInputContainer: {
    "&::after": {
      opacity: 1,
    },
  },

  input: {
    position: "relative",
    paddingTop: 3,
    paddingBottom: 5,
    paddingInlineStart: 8,
    paddingInlineEnd: 0,
    backgroundColor: "transparent",

    "&::placeholder": {
      color: colors.gray_929292,
    },

    "&:disabled": {
      color: colors.black_02,
    },

    "&:disabled::placeholder": {
      color: colors.black_02,
    },
  },

  button: {
    "&:hover, &:focus": {
      "--input-end-button-icon-color": colors.gray_262626,
    },
  },

  contentStartWrapper: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    flexGrow: 0,
    height: 24,
    maxWidth: "40%",
    marginInlineStart: 8,
    overflow: "hidden",

    ":empty": {
      display: "none",
    },
  },

  iconWrapper: {
    width: 24,
    height: 24,
    flexShrink: 0,
    flexGrow: 0,
  },

  icon: {
    transition: `color ${durations.short}ms ease`,
  },
  startIcon: {
    color: "var(--input-start-button-icon-color)",
  },
  endIcon: {
    color: "var(--input-end-button-icon-color)",
  },
  endOnClick: {
    "&:hover": {
      cursor: "pointer",
    },
    "&:disabled": {
      cursor: "default",
    },
  },

  required: {
    ...captionRegular11x12,
    display: "inline-flex",
    position: "absolute",
    alignItems: "center",
    paddingInlineStart: 4,
    paddingInlineEnd: 4,
    color: "var(--input-required-color)",
    pointerEvents: "none",
    insetInlineEnd: 8,
  },

  caption: {
    ...captionRegular11x12,
    color: "var(--input-caption-color)",
  },

  error: {
    ...captionRegular11x12,
    color: "var(--input-error-color)",

    "&:not(:last-child)": {
      marginBottom: 6,
    },
  },
}));
