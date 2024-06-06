import { memo } from "react";
import { MAP_EL_ID } from "../consts";

export const MapWrapper = memo(
    () => {
        return <div id={MAP_EL_ID} style={{ width: '100vw', height: '100vh' }}></div>;
    },
    () => true,
);