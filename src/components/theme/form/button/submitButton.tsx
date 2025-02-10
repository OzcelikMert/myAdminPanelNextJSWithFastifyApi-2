import React from 'react';

type IComponentProps = {
  text?: string;
  className?: string;
  extraClassName?: string;
  isLoading?: boolean;
  hasError?: boolean;
};

const ComponentThemeFormSubmitButton = React.memo((props: IComponentProps) => {
  return (
    <button
      type={'submit'}
      className={`btn-save ${(props.className ?? props.hasError) ? 'btn btn-gradient-danger' : 'btn btn-gradient-success'} ${props.extraClassName ?? ''}`}
      disabled={props.isLoading || props.hasError}
    >
      {props.text}
    </button>
  );
});

export default ComponentThemeFormSubmitButton;
