import { FocusEvent, memo, useCallback } from "react";

import { Input } from "../input";

export type Props = {
  min?: string;
  max?: string;
  value?: string;
  controlled?: boolean;
  disabled?: boolean;

  onChange: (value: string | undefined) => void;
};
export const DateInput = memo<Props>(
  ({ min, max, controlled, disabled, value, onChange }) => {
    const onFocus = useCallback(
      (params: { event: FocusEvent<HTMLInputElement> }) => {
        params.event.target.showPicker();
      },
      [],
    );

    return (
      <div>
        <Input
          type="date"
          min={min}
          max={max}
          showFadeOnEnd={false}
          variant="standard"
          onFocus={onFocus}
          controlled={controlled}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  },
);
DateInput.displayName = "DateInput";
