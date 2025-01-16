import React from "react";
import { useFormContext } from "react-hook-form";

type IComponentProps = {
  title?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const ComponentFormCheckBox = React.memo((props: IComponentProps) => {  
  const { register } = useFormContext();
  const registeredInput = props.name ? register(props.name) : undefined;
  
  return (
    <div className="form-check form-check-primary d-inline-block">
      <label className="form-check-label">
        <input type="checkbox" className="form-check-input" {...props} {...registeredInput}/>{' '}
        {props.title}
        <i className="input-helper"></i>
      </label>
    </div>
  );
});

export default ComponentFormCheckBox;