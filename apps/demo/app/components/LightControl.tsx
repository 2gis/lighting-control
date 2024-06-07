import type { FC} from "react";
import { useCallback, useEffect, useState } from "react"
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { Slider } from '@mapgl-shadows/ui/slider'
import {MapglLightingControl} from '@mapgl-shadows/lighting-control'
import { useMapEffect } from "../hooks/useMapEffect";
import { formatHHMM, formatToMinutes } from '../utils/date'
import type { TMap } from "../types";
import { TimelapseButton } from "./TimelapseButton";
import { Datepicker } from "./Datepicker";
import { Time } from "./Time";
import styles from './LightControl.module.css'

interface Props {
    className?: string
}

const MINUTES_IN_HOUR = 60;
const DEFAULT_TIMELAPSE_STEP_DURATION_MS = 17; // approx 1frame
const TIMELAPSE_STEP_MS = 30 * 60; // 30 mins in a second 

function radToDeg(rad: number): number {
    return 180 * (rad / Math.PI);
}

export const LightControl: FC<Props> = (props) => {
    const [lightControlPlugin, setLightControlPlugin] = useState<MapglLightingControl | null>(null);
    const [tz, setTz] = useState<string | undefined>()
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [timelapseEnabled, setTimelapseEnabled] = useState(false);
    const [timelapseInterval, setTimelapseInterval] = useState(-1);

    // На старте получаем таймзону из центра карты
    useMapEffect(({ map }) => {
        setLightControlPlugin(new MapglLightingControl(map));
        const [lng, lat] = map.getCenter();
        // @ts-expect-error no defenitions
        window.GeoTZ.find(lat, lng).then((timezones) => {
            setTz(timezones[0]);
            const date = toZonedTime(new Date(), timezones[0])
            setSelectedDate(date);
            map.once('styleload', () => {
                updateLight(map, date);
            })
        });
    }, [setTz, setSelectedDate]);

    useEffect(() => {
        let destroyed = false;
        let prevStepMs = -1;

        function doTimelapseStep() {
            if (destroyed || !timelapseEnabled || !tz) {
                return;
            }

            const currentStepMs = Date.now();
            const frameDuration = prevStepMs === -1 ? DEFAULT_TIMELAPSE_STEP_DURATION_MS : currentStepMs - prevStepMs;
            prevStepMs = currentStepMs;

            setSelectedDate((date) => {
                const nextDate = new Date(date);
                nextDate.setMilliseconds(date.getMilliseconds() + TIMELAPSE_STEP_MS * frameDuration);
                return nextDate;
            });

            requestAnimationFrame(doTimelapseStep);
        }

        doTimelapseStep();

        return () => {
            destroyed = true;
        };
    }, [tz, timelapseEnabled, setSelectedDate]);

    const onMinutesChange = useCallback((minutes: number) => {
        setSelectedDate((date) => {
            if (!tz) {
                return date;
            }

            const updatedDate = new Date(date);
            updatedDate.setHours(Math.floor(minutes / MINUTES_IN_HOUR));
            updatedDate.setMinutes(minutes % MINUTES_IN_HOUR);
            return updatedDate;
        })
    }, [tz, setSelectedDate]);

    const onDateChange = useCallback((date: Date) => {
        if (!tz) {
            return;
        }

        setSelectedDate((currentDate) => {
            const updatedDate = toZonedTime(date, tz);
            updatedDate.setHours(currentDate.getHours());
            updatedDate.setMinutes(currentDate.getMinutes());
            return updatedDate;
        });
    }, [setSelectedDate, tz]);

    const toggleTimelapse = useCallback(() => {
        setTimelapseEnabled((enabled) => !enabled);
    }, [setTimelapseEnabled]);

    const updateLight = useCallback((map: TMap, date: Date) => {
        if (!tz || !lightControlPlugin) {
            return;
        }

        lightControlPlugin.setLightingForDate(fromZonedTime(date, tz))
    }, [tz, lightControlPlugin]);

    useMapEffect(({ map }) => {
        const cb = () => {
            updateLight(map, selectedDate);
        };

        map.on('styleload', cb);
        updateLight(map, selectedDate);

        return () => {
            map.off('styleload', cb);
        };
    }, [selectedDate]);

    function makeHandyLight({ sun, moon, atmosphere }: any) {
        return {
            "none": {
                "ambientColor": { "type": "color", "value": [255, 255, 255, 255] },
                "ambientIntensity": 0,
                "dir1Color": { "type": "color", "value": [255, 255, 255, 255] },
                "dir1Altitude": 0, "dir1Azimuth": 0, "dir1Intensity": 0,
                "dir2Color": { "type": "color", "value": [255, 255, 255, 255] },
                "dir2Altitude": 0,
                "dir2Azimuth": 0,
                "dir2Intensity": 0,
                "shadowRadius": 1.5
            },
            "model": {
                "ambientColor": { "type": "color", "value": atmosphere.color },
                "ambientIntensity": atmosphere.intensity,
                "dir1Color": { "type": "color", "value": sun.color },
                "dir1Altitude": sun.altitude,
                "dir1Azimuth": sun.azimuth,
                "dir1Intensity": sun.intensity,
                "dir2Color": { "type": "color", "value": moon.color },
                "dir2Altitude": moon.altitude,
                "dir2Azimuth": moon.azimuth,
                "dir2Intensity": moon.intensity,
                "shadowRadius": 1.5,
                "shadowLightIndex": 0
            },
            "global": {
                "ambientColor": { "type": "color", "value": atmosphere.color },
                "ambientIntensity": atmosphere.intensity,
                "dir1Color": { "type": "color", "value": sun.color },
                "dir1Altitude": sun.altitude,
                "dir1Azimuth": sun.azimuth,
                "dir1Intensity": sun.intensity,
                "dir2Color": { "type": "color", "value": moon.color },
                "dir2Altitude": moon.altitude,
                "dir2Azimuth": moon.azimuth,
                "dir2Intensity": moon.intensity,
                "shadowRadius": 1.5,
                "shadowLightIndex": 0
            },
            "__JAKARTA__DEM__LIGHTING__": {
                "ambientColor": { "type": "color", "value": atmosphere.color },
                "ambientIntensity": atmosphere.intensity,
                "dir1Color": { "type": "color", "value": sun.color },
                "dir1Altitude": sun.altitude,
                "dir1Azimuth": sun.azimuth,
                "dir1Intensity": sun.intensity,
                "dir2Color": { "type": "color", "value": moon.color },
                "dir2Altitude": moon.altitude,
                "dir2Azimuth": moon.azimuth,
                "dir2Intensity": moon.intensity,
                "shadowRadius": 1.5,
            }
        }
    }

    return (<div className={props.className ? `${props.className} ${styles.lightControl}` : styles.lightControl} >
        <div className={styles.controls}>
            <Datepicker disabled={!tz} onChange={onDateChange} value={selectedDate} />
            <Time value={formatHHMM(selectedDate)} />
            <TimelapseButton active={timelapseEnabled} disabled={!tz} onClick={toggleTimelapse} />
        </div>
        <div className={styles.slider}>
            <Time noIcon value="12:00 AM" />
            <div className={styles.sliderControl}>
                <Slider
                    disabled={!tz}
                    max={1439}
                    min={0}
                    onChange={onMinutesChange}
                    onMouseMove={onMinutesChange}
                    step={1}
                    type="slider"
                    value={formatToMinutes(selectedDate)}
                />
            </div>
            <Time noIcon value="23:59 PM" />
        </div>
    </div>)
}