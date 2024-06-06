import { FC, useCallback } from "react";
import { DateInput } from "@mapgl-shadows/ui/datepicker";
import { formatToDatepicker, parseDatepickerFormat } from '../utils/date';

type Props = {
    value: Date,
    disabled?: boolean,
    onChange: (date: Date) => void
}

export const Datepicker: FC<Props> = ({ value, disabled = false, onChange }) => {
    const _onChange = useCallback((value: string | undefined) => {
        onChange(parseDatepickerFormat(value))
    }, [onChange]);
    
    return <DateInput value={formatToDatepicker(value)} disabled={disabled} onChange={_onChange} />
}