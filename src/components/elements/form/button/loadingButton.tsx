type IComponentProps = {
  text?: string;
};

export default function ComponentFormLoadingButton(props: IComponentProps) {
  return (
    <button
      className="btn btn-gradient-dark float-end btn-save"
      disabled={true}
      type={'button'}
    >
      <i className="fa fa-spinner fa-spin me-1"></i>
      {props.text}
    </button>
  );
}
