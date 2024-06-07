import * as _mapgl from '@2gis/mapgl/types/index.d.ts';

declare global {
    const mapgl: typeof _mapgl;

    interface Window {
        map: _mapgl.Map
    }
}

export as namespace mapgl;
export = _mapgl;