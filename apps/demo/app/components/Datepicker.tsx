import type { FC} from "react";
import { useCallback } from "react";
import { DateInput } from "@mapgl-shadows/ui/datepicker";
import { formatToDatepicker, parseDatepickerFormat } from '../utils/date';

interface DatepickerProps {
    value: Date,
    disabled?: boolean,
    onChange: (date: Date) => void
}

// eslint-disable-next-line react/function-component-definition -- wtf...
export const Datepicker: FC<DatepickerProps> = ({ value, disabled = false, onChange }) => {
    const _onChange = useCallback((newValue: string | undefined) => {
        onChange(parseDatepickerFormat(newValue))
    }, [onChange]);
    
    return <DateInput disabled={disabled} onChange={_onChange} value={formatToDatepicker(value)} />
}