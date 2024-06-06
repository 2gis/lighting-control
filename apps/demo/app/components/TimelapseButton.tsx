import { Button } from "@mapgl-shadows/ui/button";
import { Play } from "@mapgl-shadows/ui/icon/play";
import { FC } from "react";

type Props = {
    active: boolean,
    disabled?: boolean,
    onClick: () => void
}

const icon = <Play />

export const TimelapseButton: FC<Props> = ({ active, disabled = false, onClick }) => {
    return <Button icon={icon} disabled={disabled} appearance={active ? 'primary' : 'tertiary'} onClick={onClick}>
        {active ? 'Stop timelapse' : 'Play timelapse'}
    </Button>
}