import React from 'react';

type IComponentProps = {
  text?: string;
  className?: string;
  extraClassName?: string;
  isLoading?: boolean;
};

const ComponentThemeFormSubmitButton = React.memo((props: IComponentProps) => {
  return (
    <button
      type={'submit'}
      className={`btn-save ${props.className ?? 'btn btn-gradient-success'} ${props.extraClassName ?? ''}`}
      disabled={props.isLoading}
    >
      {props.text}
    </button>
  );
});

export default ComponentThemeFormSubmitButton;
