import type { EffectCallback} from 'react';
import { useEffect } from 'react';
import type { TApi, TMap } from '../types';
import { useMapContext } from './useMapContext';

/**
 * Позволяет сделать сайд-эффект над картой
 *
 * useMapEffect(
 * ({ map }) => {
 *   map.setCenter(center);
 * }
 */
export const useMapEffect = (
    effect: (params: { map: TMap; api: TApi }) => ReturnType<EffectCallback>,
    deps: any[],
) => {
    const { map, api } = useMapContext();

    useEffect(() => {
        if (!map || !api) {
            return;
        }

        return effect({ map, api });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, api, ...deps]);
};
