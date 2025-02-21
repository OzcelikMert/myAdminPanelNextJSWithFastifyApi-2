import { omit } from 'lodash';
import React from 'react';

export type IComponentInputSwitchProps = {
  title?: string;
  hasAnError?: boolean;
  errorText?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const ComponentInputSwitch = React.memo(
  React.forwardRef<any, IComponentInputSwitchProps>((props, ref) => {
    const idRef = React.useRef<string>(String.createId());
    const inputProps = omit(props, 'hasAnError', 'errorText');

    return (
      <div className="theme-input form-switch">
        <input
          type="checkbox"
          className="form-check-input"
          id={idRef.current}
          {...inputProps}
          ref={ref}
        />
        <label
          className="form-check-label ms-2"
          htmlFor={props.id ?? idRef.current}
        >
          {props.title}
        </label>
        {props.hasAnError ? (
          <div className="error-text">{props.errorText}</div>
        ) : null}
      </div>
    );
  })
);

export default ComponentInputSwitch;
