/**
 * Возвращает количество цифр после запятой
 *
 * {@link https://github.com/mui/material-ui/blob/d0bcc257b2d6f9b93ad2f92c1011231720dba860/packages/mui-base/src/SliderUnstyled/useSlider.ts#L106 Код взят из material-ui слайдера}
 *
 */
export function getDecimalPrecision(value: number) {
  // Это нужно для кейса, когда value очень маленькое (0.00000001), js приведёт его к экспоненциальной записи (1e-8)
  if (Math.abs(value) < 1) {
    const parts = value.toExponential().split("e-");
    const mantissaDecimalPart = parts[0]!.split(".")[1];
    return (
      (mantissaDecimalPart ? mantissaDecimalPart.length : 0) +
      parseInt(parts[1]!, 10)
    );
  }

  const decimalPart = value.toString().split(".")[1];
  return decimalPart ? decimalPart.length : 0;
}
