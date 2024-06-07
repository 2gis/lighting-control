import type { TApi } from '../types';

let promise: Promise<TApi> | undefined;
let api: TApi | undefined;

export const loadMapApi = (mapglUrl?: string): Promise<TApi> => {
  if (promise) {
    return promise;
  }

  promise = import('@2gis/mapgl')
    .then(({ load }) => load(mapglUrl))
    .then((loaded) => {
      api = loaded;
      return loaded;
    });

  return promise;
};

export const getApi = (): TApi | undefined => api;
