export interface formatterParams {
  value: number;
  precision?: number;
}

export interface parserParams {
  value: string;
  precision?: number;
}

// Определили дефолтные значение вне функции, чтобы избежать пересоздания при перерендере компонента
export const formatterDefault = ({ value, precision = 0 }: formatterParams) =>
  parseFloat(value.toFixed(precision)).toString();

export const parserDefault = ({
  value: rawValue,
  precision = 0,
}: parserParams) => {
  const value = parseFloat(Number(rawValue).toFixed(precision));

  if (Number.isNaN(value)) {
    return 0;
  }
  return value;
};
