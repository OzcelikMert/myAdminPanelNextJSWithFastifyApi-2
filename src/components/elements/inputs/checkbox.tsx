import { omit } from 'lodash';
import React from 'react';

export type IComponentInputCheckboxProps = {
  title?: string;
  hasAnError?: boolean;
  errorText?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const ComponentInputCheckbox = React.memo(
  React.forwardRef<any, IComponentInputCheckboxProps>((props, ref) => {
    const inputProps = omit(props, "hasAnError", "errorText");
    return (
      <div className="theme-input form-check form-check-primary d-inline-block">
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input"
            {...inputProps}
            ref={ref}
          />{' '}
          {props.title}
          <i className="input-helper"></i>
        </label>
        {props.hasAnError ? (
          <div className="error-text">{props.errorText}</div>
        ) : null}
      </div>
    );
  })
);

export default ComponentInputCheckbox;
