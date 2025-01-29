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
  onChange?: (
    newValue: IComponentInputSelectData<T>,
    action: ActionMeta<T>
  ) => void
} & Omit<StateManagerProps<T>, "onChange">;

const ComponentInputSelect = React.memo(
  React.forwardRef((props: IComponentInputSelectProps, ref: any) => {
    const onChange = (
      newValue: IComponentInputSelectData,
      action: ActionMeta<any>
    ) => {
      if (props.onChange) {
        props.onChange(newValue, action);
      }
    };

    return (
      <div className={`theme-input static ${props.mainDivCustomClassName}`}>
        <span className="label">{props.title}</span>
        <label className="field">
          <Select
            className="custom-select"
            classNamePrefix="custom-select"
            {...props}
            ref={ref}
            onChange={(newValue, action) => onChange(newValue, action)}
          />
        </label>
      </div>
    );
  })
);

export default ComponentInputSelect;
