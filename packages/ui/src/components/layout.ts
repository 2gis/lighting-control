import { colors } from "./colors";

export const zIndex = {
  bottom: -1,
  base: 0,
  top: 1,
};

export const size = {
  standardFrameWidth: 352,
  frameSidebarWidth: 240,
  sideFrameWidth: 300,
  sideFrameWidthWithoutSubstrate: 300,
  minimizedLayout: 0,
  controlsPanelHeight: 48,
  minimizedDataViewerPadding: 60,
};

// радиусы границ блоков
// Все зависимые компоненты, такие как кнопка, автокомплит в форме, баннер или тост, скругляются на 4 px,
// Все маленькие элементы, такие как иконки у контактов ЗМК, скругляются на 2px
// Все сложные и изолированные компоненты, такие как модальные окна или формы в попапе — на 6 px
// Есть исключения, такие как овальная кнопка или выпадашка селекта, обусловленая овальной формой селекта.

export const borderRadius = {
  default: "4px",
  defaultOnlyTop: "4px 4px 0 0",
  defaultOnlyEnd: "logical 0 4px 4px 0",
  defaultOnlyStart: "logical 4px 0 0 4px",
  small: "2px",
  medium: "8px",
  large: "12px",
  isolate: "6px",
  mapControl: "6px",
  rounded: "9999px",
  circle: "50%",
};

// общие стили для неосновного скролла
// в старых браузерах будет использоваться старый скролл
export const scrollStyles = {
  scrollbarColor: `${colors.gray_d6d6d6} ${colors.gray_ededed}`,
  scrollbarWidth: "thin",

  // фолбэк для браузеров поддерживающих старый синтаксис
  "::-webkit-scrollbar-thumb": {
    backgroundColor: colors.gray_d6d6d6,
  },

  "::-webkit-scrollbar-track": {
    backgroundColor: colors.gray_ededed,
  },

  "::-webkit-scrollbar": {
    width: "8px",
  },
} as const;

/**
 * Стили для скрытия элемента
 *
 * {@link https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/visually-hidden/src/VisuallyHidden.tsx#L31 Код взят из дизайн системы adobe/react-spectrum}
 */
export const visuallyHidden: any = {
  border: "none",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  margin: "0 -1px -1px 0",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: 1,
  whiteSpace: "nowrap",
};
