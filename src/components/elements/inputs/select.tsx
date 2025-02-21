import React from 'react';
import Select, { ActionMeta } from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';

export type IComponentInputSelectData<T = any> = {
  label: string;
  value: T;
} & { [key: string]: any };

export type IComponentInputSelectProps<T = any> = {
  title?: string;
  mainDivCustomClassName?: string;
  options?: IComponentInputSelectData<T>[];
  hasAnError?: boolean;
  errorText?: string;
  onChange?: (newValue: T[] | T, action: ActionMeta<T>) => void;
} & Omit<StateManagerProps<T>, 'onChange' | 'options'>;

const ComponentInputSelect = React.memo(
  React.forwardRef<any, IComponentInputSelectProps>((props, ref) => {
    const onChange = (
      newValue: IComponentInputSelectData | IComponentInputSelectData[],
      action: any
    ) => {
      if (props.onChange) {
        let customNewValue;

        if (Array.isArray(newValue)) {
          customNewValue = newValue.map((data) => data.value);
        } else {
          customNewValue = newValue.value;
        }

        props.onChange(customNewValue, action);
      }
    };

    return (
      <div
        className={`theme-input static ${props.mainDivCustomClassName ?? ''}`}
      >
        <span className="label">{props.title}</span>
        <label className={`field ${props.hasAnError ? 'error' : ''}`}>
          <Select
            className="custom-select"
            classNamePrefix="custom-select"
            {...props}
            ref={ref}
            onChange={(newValue, action) => onChange(newValue, action)}
          />
        </label>
        {props.hasAnError ? (
          <div className="error-text">{props.errorText}</div>
        ) : null}
      </div>
    );
  })
);

export default ComponentInputSelect;
