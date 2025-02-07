import React from 'react';
import Select, { ActionMeta } from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';

export interface IComponentInputSelectData<T = any> {
  label: string;
  value: T;
}

export type IComponentInputSelectProps<T = any> = {
  title?: string;
  mainDivCustomClassName?: string;
  options?: IComponentInputSelectData<T>[];
  hasAnError?: boolean;
  errorText?: string;
  onChange?: (
    newValue: IComponentInputSelectData<T>[] | IComponentInputSelectData<T>,
    action: ActionMeta<T>
  ) => void;
} & Omit<
  StateManagerProps<IComponentInputSelectData<T>>,
  'onChange' | 'options'
>;

const ComponentInputSelect = React.memo(
  React.forwardRef<any, IComponentInputSelectProps>((props, ref) => {
    const onChange = (newValue: any, action: any) => {
      if (props.onChange) {
        props.onChange(newValue, action);
      }
    };

    return (
      <div className={`theme-input static ${props.mainDivCustomClassName ?? ""}`}>
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
