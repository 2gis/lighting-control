import { CssObjectForAphrodite, useStyles } from "../../hooks/useStyles";

import { styles } from ".";

/**
 * Хук для получения стилей кнопки и контента кнопки в зависимости от пропсов.
 */
export const useButtonStyles = ({
  appearance,
  wide,
  compact,
  fat,
  round,
  hiddenContent,
  isIconOnStart,
  isIconOnEnd,
}: {
  appearance?: "primary" | "secondary" | "tertiary";
  wide?: boolean;
  fat?: boolean;
  compact?: boolean;
  round?: boolean;
  hiddenContent?: boolean;
  isIconOnStart?: boolean;
  isIconOnEnd?: boolean;
}) => {
  const { s } = useStyles(styles);
  const mutableButtonStyles: CssObjectForAphrodite[] = [];
  const mutableContentStyles: CssObjectForAphrodite[] = [];

  switch (appearance) {
    case "secondary": {
      mutableButtonStyles.push(s._secondary);
      break;
    }
    case "tertiary": {
      mutableButtonStyles.push(s._tertiary);
      break;
    }
    case "primary":
    default: {
      mutableButtonStyles.push(s._primary);
      break;
    }
  }

  if (fat) {
    mutableButtonStyles.push(s._fat);
  } else if (compact) {
    mutableButtonStyles.push(s._compact);
  }

  if (wide) {
    mutableButtonStyles.push(s._wide);
  }

  if (round) {
    mutableButtonStyles.push(s._round);
  }

  // Добавляем стили для кнопки со скрытым контентом, который появляется по ховеру
  if (hiddenContent) {
    mutableButtonStyles.push(s._hiddenContentButton);
    mutableContentStyles.push(s._hiddenContent);
  }

  // Регулируем паддинги у контента в зависимости от того с какой стороны иконка
  if (isIconOnStart) {
    mutableContentStyles.push(s._iconOnStart);
  } else if (isIconOnEnd) {
    mutableContentStyles.push(s._iconOnEnd);
  }

  // Выравниваем контент в кнопке со скрытым контентом по краю по которому расположена иконка
  if (isIconOnStart && hiddenContent) {
    mutableButtonStyles.push(s._justifyStart);
  } else if (isIconOnEnd && hiddenContent) {
    mutableButtonStyles.push(s._justifyEnd);
  }

  return {
    buttonStyles: mutableButtonStyles,
    contentStyles: mutableContentStyles,
  };
};
