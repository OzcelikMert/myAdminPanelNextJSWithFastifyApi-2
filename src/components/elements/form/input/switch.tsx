import React from 'react';
import { useFormContext } from 'react-hook-form';

type IComponentProps = {
  title?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const ComponentFormSwitch = React.memo((props: IComponentProps) => {
  const form = useFormContext();
  const registeredInput =
    form && props.name ? form.register(props.name) : undefined;

  const idRef = React.useRef<string>(String.createId());

  if (registeredInput && props.name) {
    const watchName = form.watch(props.name);
  }

  return (
    <div className="form-switch">
      <input
        type="checkbox"
        className="form-check-input"
        id={idRef.current}
        {...registeredInput}
        {...props}
      />
      <label
        className="form-check-label ms-2"
        htmlFor={props.id ?? idRef.current}
      >
        {props.title}
      </label>
    </div>
  );
});

export default ComponentFormSwitch;
