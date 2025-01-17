import React from 'react';
import { useFormContext } from 'react-hook-form';

type IComponentProps = {
  title?: string;
  valueAsNumber?: boolean;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const ComponentFormCheckBox = React.memo((props: IComponentProps) => {
  const form = useFormContext();
  const registeredInput =
    form && props.name
      ? form.register(props.name)
      : undefined;

  if (form && props.name) {
    const watchName = form.watch(props.name);
  }

  return (
    <div className="form-check form-check-primary d-inline-block">
      <label className="form-check-label">
        <input
          type="checkbox"
          className="form-check-input"
          {...registeredInput}
          {...props}
        />{' '}
        {props.title}
        <i className="input-helper"></i>
      </label>
    </div>
  );
});

export default ComponentFormCheckBox;
