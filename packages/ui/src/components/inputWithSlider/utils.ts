/** Максимальное количество цифр, которое поместится в поле */
const MAX_INPUT_SIZE = 20;
/** Ширина одной буквы в px */
const WIDTH_OF_ONE_DIGIT = 7.5;
/** Ширина которую занимают `.` и `-` в случае если ли в value присутствуют только они */
const SYMBOL_SPACE = 5;

/**
 * Возвращает ширину инпута в зависимости от количества символов в `value`.
 *
 *  TODO: заменить на более универсальный и надёжный способ задания ширины.
 * - Можно, например, вместо `px` использовать `em`.
 */
export function getInputWidth(value: string) {
  return Math.min(
    MAX_INPUT_SIZE * WIDTH_OF_ONE_DIGIT + SYMBOL_SPACE,
    Math.max(value.length * WIDTH_OF_ONE_DIGIT + SYMBOL_SPACE, SYMBOL_SPACE),
  );
}
