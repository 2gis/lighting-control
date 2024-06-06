/**
 * Получает текущий dir и lrt-значение
 * Преобразует его для RTL
 */
export function getRTLCSSValue({
  dir,
  ltrValue,
}: {
  dir: "ltr" | "rtl";
  ltrValue: string;
}) {
  if (dir === "ltr") {
    return ltrValue;
  }

  return ltrValue.indexOf("-") !== -1
    ? ltrValue.replace("-", "")
    : `-${ltrValue}`;
}
