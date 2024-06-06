import { useContext } from 'react';

import { MapContext } from '../context/map';

export const useMapContext = () => {
  return useContext(MapContext);
};
