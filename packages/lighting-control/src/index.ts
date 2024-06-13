import { getPosition, getMoonPosition, getTimes } from "suncalc";
import type Mapgl from "../project";
import { radToDeg } from "./utils";

interface DirectionalLightSource {
  altitude: number;
  azimuth: number;
  color: [number, number, number];
  intensity: number;
}

interface AmbientLightSource {
  intensity: number;
  color: [number, number, number];
}

const SUN_INTENSITY = 0.3;
const AMBIENT_INTENSITY = 0.75;
const MOON_INTENSITY = 0;

export class MapglLightingControl {
  constructor(private map: Mapgl.Map) {}

  public setLightingForDate(date: Date): void {
    const [lng, lat] = this.map.getCenter();
    const sunPosition = getPosition(date, lat, lng);
    const moonPosition = getMoonPosition(date, lat, lng);

    const sunAltitude = radToDeg(sunPosition.altitude);
    const sunAzimuth = radToDeg(sunPosition.azimuth + Math.PI);
    const moonAltitude = radToDeg(moonPosition.altitude);
    const moonAzimuth = radToDeg(moonPosition.azimuth + Math.PI);

    const sunIntensity = Math.sin(sunPosition.altitude) < 0 ? 0 : SUN_INTENSITY;
    const moonIntensity = MOON_INTENSITY;
    
    const ambientIntensity = AMBIENT_INTENSITY - moonIntensity;

    const GBColorFactor = Math.round(255 * (0.9 + 0.1 * Math.max(0, Math.sin(sunPosition.altitude))));

    this.setLighting({
      sun: {
        altitude: sunAltitude,
        azimuth: sunAzimuth,
        color: [255, 255, 255],
        intensity: sunIntensity,
      },
      moon: {
        altitude: moonAltitude,
        azimuth: moonAzimuth,
        color: [255, 255, 255],
        intensity: moonIntensity,
      },
      atmosphere: {
        color: [255, GBColorFactor, GBColorFactor],
        intensity: ambientIntensity,
      },
      shadowSource: "sun",
    });
  }

  private setLighting(lightingConfig: {
    sun: DirectionalLightSource;
    moon: DirectionalLightSource;
    atmosphere: AmbientLightSource;
    shadowSource: "sun" | "moon";
  }): void {
    // @ts-expect-error -- Hidden member access
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- Hidden member access
    this.map.setLightingStyle({
      sources: {
        sun: {
          type: "directional",
          altitude: lightingConfig.sun.altitude,
          azimuth: lightingConfig.sun.azimuth,
          color: ['to-color', `rgb(${lightingConfig.sun.color[0]}, ${lightingConfig.sun.color[1]}, ${lightingConfig.sun.color[2]})`],
          intensity: lightingConfig.sun.intensity,
        },
        moon: {
          type: "directional",
          altitude: lightingConfig.moon.altitude,
          azimuth: lightingConfig.moon.azimuth,
          color: ['to-color', `rgb(${lightingConfig.moon.color[0]}, ${lightingConfig.moon.color[1]}, ${lightingConfig.moon.color[2]})`],
          intensity: lightingConfig.moon.intensity,
        },
        atmosphere: {
          type: "ambient",
          color: ['to-color', `rgb(${lightingConfig.atmosphere.color[0]}, ${lightingConfig.atmosphere.color[1]}, ${lightingConfig.atmosphere.color[2]})`],
          intensity: lightingConfig.atmosphere.intensity,
        },
      },
      lightingModes: {
        global: ["sun", "moon", "atmosphere"],
      },
      defaultLightingMode: "global",
      shadow: {
        source: lightingConfig.shadowSource,
      },
    });
  }
}
