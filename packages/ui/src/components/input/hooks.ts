import { InputType } from "./types";

/**
 * Проверяет допустимое ли значение введено
 *
 * Не является валидацией значения
 */
export const useCheckValue = (type: InputType) => {
  let fn: (value: string) => string | null;
  switch (type) {
    case "number": {
      fn = validateNumber;
      break;
    }
    case "text":
    default: {
      fn = identity;
    }
  }

  return fn;
};

const identity = <T>(v: T) => v;

const validateNumber = (rawValue: string) => {
  // Служебные символы нужные для корректной работы поля
  const INTERMEDIATE_SYMBOLS = ["+", "-", ".", ""];

  const value = rawValue.trim();

  if (INTERMEDIATE_SYMBOLS.includes(value)) {
    return value;
  }

  if (!Number.isFinite(Number(value))) {
    return null;
  }

  return value;
};
