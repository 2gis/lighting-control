import { getPosition, getMoonPosition} from "suncalc";
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

const MAX_SUN_INTENSITY = 0.6;
const MAX_AMBIENT_INTENSITY = 0.7;
const MAX_MOON_INTENSITY = 0.2; // Пока что не учитываем фазы луны

export class MapglLightingControl {
  constructor(private map: Mapgl.Map) {}

  public setLightingForDate(date: Date): void {
    const [lng, lat] = this.map.getCenter();
    const sunPosition = getPosition(date, lat, lng);
    const moonPosition = getMoonPosition(date, lat, lng);

    const sunAltitude = radToDeg(sunPosition.altitude);
    const sunAzimuth = radToDeg(sunPosition.azimuth);
    const moonAltitude = radToDeg(moonPosition.altitude);
    const moonAzimuth = radToDeg(moonPosition.azimuth);

    const sunIntensityFactor =
      sunAltitude > 0 ? Math.max(sunAltitude / 90, 0.85) : 0;
    const moonIntensityFactor =
      moonAltitude > 0 ? Math.max(moonAltitude / 90, 0.85) : 0;

    const sunIntensity = MAX_SUN_INTENSITY * sunIntensityFactor;
    const moonIntensity = MAX_MOON_INTENSITY * moonIntensityFactor;
    const ambientIntensity = Math.max(
      0.5,
      ((sunIntensity + moonIntensity) /
        (MAX_SUN_INTENSITY + MAX_MOON_INTENSITY)) *
        MAX_AMBIENT_INTENSITY,
    );

    const hour = date.getHours() + date.getMinutes() / 60;
    const colorFactor =
      Math.max(0, 1 - Math.max(0, (hour < 10 ? 10 - hour : hour - 14) / 6));

    this.setLighting({
      sun: {
        altitude: sunAltitude,
        azimuth: sunAzimuth,
        color: [255, Math.round(255 * (0.5 + colorFactor / 2)), Math.round(255 * colorFactor)],
        intensity: sunIntensity,
      },
      moon: {
        altitude: moonAltitude,
        azimuth: moonAzimuth,
        color: [255, 255, 255],
        intensity: moonIntensity,
      },
      atmosphere: {
        color: [255, 255, 255],
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
