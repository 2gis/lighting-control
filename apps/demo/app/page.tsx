'use client'

import styles from "./page.module.css";
import { MapProvider } from "./context/map";
import { MapglMap } from './components/MapglMap'
import { LightControl } from './components/LightControl';

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <MapProvider>
        <MapglMap />
        <LightControl className={styles.lightControl} />
      </MapProvider>
    </main>
  );
}
