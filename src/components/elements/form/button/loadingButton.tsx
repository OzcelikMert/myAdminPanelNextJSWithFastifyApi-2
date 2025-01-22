import React from 'react';

type IComponentProps = {
  text?: string;
  className?: string;
};

const ComponentFormLoadingButton = React.memo((props: IComponentProps) => {
  return (
    <button
      className={`${props.className} btn btn-gradient-dark float-end btn-save`}
      disabled={true}
      type={'button'}
    >
      <i className="fa fa-spinner fa-spin me-1"></i>
      {props.text}
    </button>
  );
});

export default ComponentFormLoadingButton;
