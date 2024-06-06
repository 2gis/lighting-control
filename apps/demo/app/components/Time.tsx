import { FC } from "react"
import { Clock } from "@mapgl-shadows/ui/icon/clock"
import { Text } from "@mapgl-shadows/ui/text"
import styles from './Time.module.css'

type Props = {
    value: string,
    noIcon?: boolean
}

export const Time: FC<Props> = ({ value, noIcon = false }) => {
    return (
        <div className={styles.time}>
            {noIcon ? null : <Clock />}
            <Text type={'title15'}>
                {value}
            </Text>
        </div>
    )
}
