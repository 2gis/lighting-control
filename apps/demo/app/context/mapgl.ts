import { TApi } from '../types';

let promise: Promise<TApi> | undefined = undefined;
let api: TApi | undefined = undefined;

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

export const getApi = () => api;
