import React from 'react';

export type IComponentInputSwitchProps = {
  title?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const ComponentInputSwitch = React.memo(
  React.forwardRef<any, IComponentInputSwitchProps>((props, ref) => {
    const idRef = React.useRef<string>(String.createId());

    return (
      <div className="form-switch">
        <input
          type="checkbox"
          className="form-check-input"
          id={idRef.current}
          {...props}
          ref={ref}
        />
        <label
          className="form-check-label ms-2"
          htmlFor={props.id ?? idRef.current}
        >
          {props.title}
        </label>
      </div>
    );
  })
);

export default ComponentInputSwitch;
