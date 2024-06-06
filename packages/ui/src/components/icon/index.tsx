import { memo, PropsWithChildren } from "react";

import { createStyles, CSSInputTypes, useStyles } from "../../hooks/useStyles";

/**
 * Компонент делает блочным вложенный в него svg,
 * чтобы убрать у него лишние оступы из-за line-height
 * Вырубать line-height у svg можно, но мало ли, что-то будет в иконке, что line-height будет нужен
 * Поэтому просто делаем svg блочным и все)
 *
 * В качестве children ожидается иконка
 */
type Props = {
  aphroditeStyles?: CSSInputTypes | Array<CSSInputTypes | undefined>;
};
export const Icon = memo<PropsWithChildren<Props>>(
  ({ children, aphroditeStyles }) => {
    const { css, s } = useStyles(styles);

    const additionalAphroditeStyles = Array.isArray(aphroditeStyles)
      ? aphroditeStyles
      : [aphroditeStyles];

    return (
      <div className={css(s.root, ...additionalAphroditeStyles)}>
        {children}
      </div>
    );
  },
);
Icon.displayName = "Icon";

const styles = createStyles({
  root: {
    "& > svg": {
      display: "block",
    },
  },
});
