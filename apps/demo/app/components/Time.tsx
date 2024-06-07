import type { FC } from "react"
import { Clock } from "@mapgl-shadows/ui/icon/clock"
import { Text } from "@mapgl-shadows/ui/text"
import styles from './Time.module.css'

interface TimeProps {
    value: string,
    noIcon?: boolean
}

// eslint-disable-next-line react/function-component-definition -- wtf
export const Time: FC<TimeProps> = ({ value, noIcon = false }) => {
    return (
        <div className={styles.time}>
            {noIcon ? null : <Clock />}
            <Text type="title15">
                {value}
            </Text>
        </div>
    )
}
