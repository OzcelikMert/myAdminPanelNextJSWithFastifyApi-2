type IComponentProps = {
  title?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function ComponentFormCheckBox(props: IComponentProps) {
  return (
    <div className="form-check form-check-primary d-inline-block">
      <label className="form-check-label">
        <input type="checkbox" className="form-check-input" {...props} />{' '}
        {props.title}
        <i className="input-helper"></i>
      </label>
    </div>
  );
}