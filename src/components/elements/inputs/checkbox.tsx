import React from 'react';

export type IComponentInputCheckboxProps = {
  title?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const ComponentInputCheckbox = React.memo(
  React.forwardRef<any, IComponentInputCheckboxProps>((props, ref) => {
    return (
      <div className="form-check form-check-primary d-inline-block">
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input"
            {...props}
            ref={ref}
          />{' '}
          {props.title}
          <i className="input-helper"></i>
        </label>
      </div>
    );
  })
);

export default ComponentInputCheckbox;
