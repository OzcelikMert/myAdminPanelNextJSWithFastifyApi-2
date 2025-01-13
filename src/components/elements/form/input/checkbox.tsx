import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

type IComponentProps = {
  title?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function ComponentFormCheckBox(props: IComponentProps) {  
  const { register } = useFormContext();
  
  return (
    <div className="form-check form-check-primary d-inline-block">
      <label className="form-check-label">
        <input type="checkbox" className="form-check-input" {...props} {...(props.name && register(props.name))}/>{' '}
        {props.title}
        <i className="input-helper"></i>
      </label>
    </div>
  );
};