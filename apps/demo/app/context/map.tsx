import { createContext, FC, ReactNode, useRef, useState } from 'react';
import { getApi, loadMapApi } from './mapgl'
import { TMap, TApi } from '../types';

type MapContext = {
  map?: TMap;
  api?: TApi;
  ensureMap: () => Promise<TMap>;
  ensureApi: () => Promise<TApi>;
  setMap: (map: TMap | undefined) => void;
};

export const MapContext = createContext<MapContext>({
  ensureMap: () => {
    throw new Error('Use MapProvider');
  },
  ensureApi: () => {
    throw new Error('Use MapProvider');
  },
  setMap: () => {
    new Error('Use MapProvider');
  },
});

export const MapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [api, setApi] = useState(() => getApi());
  const [map, setMapState] = useState<TMap | undefined>(undefined);


  // @TODO
  // сейчас этот промис одноразовый — если карта инициализируется дважды, в промисе останется первая
  const mapResolveRef = useRef<((map: TMap) => void) | null>(null);
  const [mapPromise] = useState(
    () =>
      new Promise<TMap>((resolve) => {
        mapResolveRef.current = resolve;
      }),
  );

  const ensureApi = async () => {
    const api = await loadMapApi('https://mapgl.2gis.com/api/js/v0.0.333');
    setApi(api);
    return api;
  };

  const ensureMap = async () => {
    return mapPromise;
  };

  const setMap = (m: TMap | undefined) => {
    m && mapResolveRef.current?.(m);
    setMapState(m);
  };

  const ctx = {
    ensureApi,
    ensureMap,
    setMap,
    map,
    api,
  };

  // @TODO
  // сделать разные контексты для map и api, чтобы в нужный момент обновлялись только нужные контексты
  return <MapContext.Provider value={ctx}>{children}</MapContext.Provider>;
};
