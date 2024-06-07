import { keyframes } from "@2gis-kit/css";

export const durations = {
  /**
   * Мгновенные анимации: перемещение ползунка слайдера
   */
  nano: 50,
  /**
   * Длительность анимации: кнопок, табов и других небольшим элементов
   */
  short: 150,
  /**
   * Длительность анимации появления небольших элементов.
   *
   * @example
   * - Появление контента при ховере кнопки "Создать группу слоёв"
   */
  medium: 300,

  /**
   * Длительность повторяющихся анимаций вращения, трансорфмаций
   */
  slow: 1200,

  /** Длительность перелёта к объекту */
  fly: 200,

  /** Длительность зума к объекту */
  zoom: 300,
};

export const rotateAnimation = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});