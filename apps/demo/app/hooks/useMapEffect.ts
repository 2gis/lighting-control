import { EffectCallback, useEffect } from 'react';

import { TApi, TMap } from '../types';

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

    return useEffect(() => {
        if (!map || !api) {
            return;
        }

        return effect({ map, api });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, api, ...deps]);
};
