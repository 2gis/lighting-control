import { useEffect } from "react";
import type { FC } from 'react'
import { useMapContext } from '../hooks/useMapContext'
import { MAP_EL_ID } from '../consts'
import type { TMap } from "../types";
import { MapWrapper } from "./MapWrapper";

const DEFAULT_CENTER: [number, number] = [55.31878, 25.23584];

// eslint-disable-next-line react/function-component-definition -- wtf
export const MapglMap: FC = () => {
  const { ensureApi, setMap } = useMapContext();

  useEffect(() => {
    let map: TMap | undefined;
    let cancelled = false;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- ok here
    ensureApi().then((api) => {
      if (cancelled) {
        return;
      }

      const search = new URLSearchParams(window.location.search);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we're sure
      const lngFromURL = search.has('lng') ? parseFloat(search.get('lng')!) : DEFAULT_CENTER[0];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we're sure
      const latFromURL = search.has('lat') ? parseFloat(search.get('lat')!) : DEFAULT_CENTER[1];

      map = new api.Map(
        MAP_EL_ID,
        {
          center: [lngFromURL, latFromURL],
          zoom: 18,
          key: process.env.NEXT_PUBLIC_MAPGL_API_KEY,
          enableTrackResize: true,
          disableAntiAliasing: false,
          maxPitch: 80,
          lowZoomMaxPitch: 80,
        }
      );

      map.on('moveend', () => {
        if (!map) {
          return;
        }

        const [lng, lat] = map.getCenter();
        search.set('lng', lng.toPrecision(8));
        search.set('lat', lat.toPrecision(8));
        history.replaceState({}, document.title, `${window.location.origin}${window.location.pathname}?${search.toString()}`);
      });

      // Выкинем инстанс карты в глобальный скоуп для удобного дебага и для e2e-тестов
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we have defined map instance
      window.map = map!;

      setMap(map);
    });

    return () => {
      cancelled = true;
      map?.destroy();
      setMap(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- wtf
  }, []);


  return <MapWrapper />
}