import { Button } from "@mapgl-shadows/ui/button";
import { Play } from "@mapgl-shadows/ui/icon/play";
import type { FC } from "react";

interface Props {
    active: boolean,
    disabled?: boolean,
    onClick: () => void
}

const icon = <Play />

export const TimelapseButton: FC<Props> = ({ active, disabled = false, onClick }) => {
    return <Button appearance={active ? 'primary' : 'tertiary'} disabled={disabled} icon={icon} onClick={onClick}>
        {active ? 'Stop timelapse' : 'Play timelapse'}
    </Button>
}