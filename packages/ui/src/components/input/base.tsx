import {
  memo,
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";

import {
  createStyles,
  CssObjectForAphrodite,
  useStyles,
} from "../../hooks/useStyles";

import { regular } from "../typography";

import { useCheckValue } from "./hooks";
import { InputType } from "./types";

type BaseInputProps = {
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
   */
  type: InputType;

  /**
   * Лейбл поля для скринридера
   *
   * Можно не указывать если задан `label`.
   */
  ariaLabel?: string;
  /** Плейсхолдер для поля */
  placeholder?: string;
  /**
   * Текст, который будет появляться в нативном тултипе при наведении на поле
   */
  title?: string;
  /**
   * Определяет может ли браузер предлагать автозаполнение поля
   * и какие данные браузер будет предлагать для автозаполнения.
   *
   * default - `off`
   */
  autoComplete?: string;
  /**
   * Определяет зафокусится ли поле автоматически при появлении на странице
   *
   * default - `false`
   */
  autoFocus?: boolean;
  /**
   * Ссылка на поле
   */
  inputRef?: React.Ref<any>;

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

  /** Стили заданные из вне */
  className?: CssObjectForAphrodite | Array<CssObjectForAphrodite | undefined>;

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
    event: KeyboardEvent<HTMLInputElement>;
    value: string;
  }) => void;
  /** Функция вызывается при снятии фокуса с поля */
  onBlur?: (params: {
    event: FocusEvent<HTMLInputElement>;
    value: string;
  }) => void;
  /** Функция вызывается при фокусе поля */
  onFocus?: (params: {
    event: FocusEvent<HTMLInputElement>;
    value: string;
  }) => void;
  onClick?: (params: {
    event: MouseEvent<HTMLInputElement>;
    value: string;
  }) => void;
  onMouseEnter?: (event: MouseEvent<HTMLInputElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLInputElement>) => void;
};

/**
 * Базовый input без стилей
 *
 * Это просто нативный инпуп. Его нужно стилизовать самостоятельно.
 *
 * TODO_INPUT:
 * - сделать валидацию
 * - подумать нужен ли `required` в нативном `<input>`
 */
export const BaseInput = memo<BaseInputProps>((props) => {
  const {
    value = "",
    type = "text",
    autoComplete = "off",
    inputRef,
    title,
    autoFocus = false,
    disabled = false,
    required = false,
    controlled = true,
    readOnly = false,
    className,
    formatter,
    parser,
    onClick,
    onChange,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    onBlur,
    onFocus,
    min,
    max,
  } = props;

  const { css, s } = useStyles(styles);

  const inputType = type === "number" ? "text" : type;

  const [inputValue, setInputValue] = useState(
    formatter ? formatter(value) : value,
  );

  const checkValue = useCheckValue(type);

  const changeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.currentTarget.value;
      const parsedValue = parser ? parser(rawValue) : rawValue;
      const validatedValue = checkValue(parsedValue);

      if (validatedValue === null) {
        return;
      }

      if (controlled) {
        setInputValue(parsedValue);
      }

      if (onChange) {
        onChange(parsedValue);
      }
    },
    [parser, checkValue, controlled, onChange],
  );

  const keyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const rawValue = event.currentTarget.value;
    const parsedValue = parser ? parser(rawValue) : rawValue;

    if (onKeyDown) {
      onKeyDown({ event, value: parsedValue });
    }
  };

  const blurHandler = (event: FocusEvent<HTMLInputElement>) => {
    const rawValue = event.currentTarget.value;
    const parsedValue = parser ? parser(rawValue) : rawValue;

    if (onBlur) {
      onBlur({ event, value: parsedValue });
    }
  };

  const focusHandler = (event: FocusEvent<HTMLInputElement>) => {
    const rawValue = event.currentTarget.value;
    const parsedValue = parser ? parser(rawValue) : rawValue;

    if (onFocus) {
      onFocus({ event, value: parsedValue });
    }
  };

  const clickHandler = (event: MouseEvent<HTMLInputElement>) => {
    const rawValue = event.currentTarget.value;
    const parsedValue = parser ? parser(rawValue) : rawValue;

    if (onClick) {
      onClick({ event, value: parsedValue });
    }
  };

  useEffect(() => {
    if (controlled) {
      setInputValue(formatter ? formatter(value) : value);
    }
  }, [controlled, formatter, value]);

  return (
    <input
      value={controlled ? inputValue : undefined}
      defaultValue={controlled ? undefined : inputValue}
      className={css(s.input, className)}
      type={inputType}
      placeholder={props.placeholder}
      title={title}
      aria-label={props.ariaLabel}
      autoComplete={autoComplete}
      autoCorrect="off"
      autoCapitalize="off"
      autoFocus={autoFocus}
      id={props.id}
      name={props.name}
      form={props.form}
      minLength={props.minLength}
      maxLength={props.maxLength}
      min={min}
      max={max}
      ref={inputRef}
      // TODO_INPUT: Подумать действительно ли этот атрибут нужен
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      spellCheck={false}
      pattern={props.pattern}
      onClick={clickHandler}
      onChange={changeHandler}
      onKeyDown={keyDownHandler}
      onBlur={blurHandler}
      onFocus={focusHandler}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ width: props.width }}
    />
  );
});
BaseInput.displayName = "BaseInput";

const styles = createStyles({
  input: {
    ...regular,
    width: "100%",
    /**
     * Исправляем bug в firefox с высотой инпута
     * https://hg.mozilla.org/mozilla-central/rev/b97aef275b5e
     */
    height: 24,
    border: "none",
    outline: "none",

    "::-webkit-search-cancel-button": {
      WebkitAppearance: "none",
    },

    "::-ms-clear": {
      display: "none",
    },

    "&:disabled": {
      backgroundColor: "transparent",
    },
  },
});
