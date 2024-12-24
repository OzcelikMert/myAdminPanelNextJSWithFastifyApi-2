import React, { Component } from 'react';
import ComponentFormLoadingButton from './button/loadingButton';

type IComponentProps = {
  isActiveSaveButton?: boolean;
  saveButtonText?: string;
  saveButtonLoadingText?: string;
  saveButtonClassName?: string;
  isSubmitting?: boolean;
  formAttributes?: React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >;
  children: any;
  enterToSubmit?: true;
};

export default function ComponentForm(props: IComponentProps) {
  return (
    <form
      className="theme-form"
      {...props.formAttributes}
      onKeyDown={(event) => {
        if (!props.enterToSubmit && event.key === 'Enter') event.preventDefault();
      }}
    >
      {props.children}
      <div className="submit-btn-div text-end mb-4">
        {props.isActiveSaveButton ? (
          !props.isSubmitting ? (
            <button
              type={'submit'}
              className={`btn btn-gradient-success btn-save ${props.saveButtonClassName ?? ''}`}
            >
              {props.saveButtonText}
            </button>
          ) : (
            <ComponentFormLoadingButton text={props.saveButtonLoadingText} />
          )
        ) : null}
      </div>
    </form>
  );
}