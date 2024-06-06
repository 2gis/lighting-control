import { useEffect } from "react";
import { MapWrapper } from "./MapWrapper";
import { useMapContext } from '../hooks/useMapContext'
import { MAP_EL_ID } from '../consts'
import { TMap } from "../types";

const DEFAULT_CENTER: [number, number] = [55.31878, 25.23584];

export function MapglMap() {
    const { ensureApi, setMap } = useMapContext();

    useEffect(() => {
        let map: TMap | undefined = undefined;
        let cancelled = false;
    
        ensureApi().then((api) => {
          if (cancelled) {
            return;
          }

          const search = new URLSearchParams(window.location.search);
          const lng = search.get('lng') ? parseFloat(search.get('lng')!) : DEFAULT_CENTER[0];
          const lat = search.has('lat') ? parseFloat(search.get('lat')!) : DEFAULT_CENTER[1];

          map = new api.Map(
            MAP_EL_ID,
            {
                center: [lng, lat],
                zoom: 18,
                key: '4970330e-7f1c-4921-808c-0eb7c4e63001',
                enableTrackResize: true,
            }
          );

          map.on('moveend', () => {
            search.set('lng', map!.getCenter()[0]!.toString());
            search.set('lat', map!.getCenter()[1]!.toString());
            history.replaceState({}, document.title, search.toString());
          });

          // Выкинем инстанс карты в глобальный скоуп для удобного дебага и для e2e-тестов
          (window as any).map = map;
    
          setMap(map);
        });
    
        return () => {
          cancelled = true;
          map?.destroy();
          setMap(undefined);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    

    return <MapWrapper />
}