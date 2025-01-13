import { FormEvent, useState } from 'react';
import ComponentFormLoadingButton from './button/loadingButton';
import { FormProvider, UseFormReturn } from 'react-hook-form';

type IComponentState = {
  isSubmitting: boolean;
};

const initialState: IComponentState = {
  isSubmitting: false,
};

type IComponentProps = {
  hideSubmitButton?: boolean;
  submitButtonText?: string | React.ReactNode;
  submitButtonSubmittingText?: string;
  submitButtonClassName?: string;
  children: React.ReactNode;
  enterToSubmit?: true;
  onSubmit?: (data: any) => Promise<void> | void;
  formMethods: UseFormReturn<any>
};

export default function ComponentForm(props: IComponentProps) {
  const SubmitButton = () => {
    return (
      <button
        type={'submit'}
        className={`btn-save ${props.submitButtonClassName ?? 'btn btn-gradient-success'}`}
        disabled={props.formMethods.formState.isSubmitting}
      >
        {props.submitButtonText}
      </button>
    );
  };

  return (
    <FormProvider {...props.formMethods}>
      <form
        className="theme-form"
        onKeyDown={(event) => {
          if (!props.enterToSubmit && event.key === 'Enter')
            event.preventDefault();
        }}
        onSubmit={props.onSubmit && props.formMethods.handleSubmit(props.onSubmit)}
      >
        {props.children}
        <div className="submit-btn-div text-end mb-4">
          {props.hideSubmitButton ? null : !props.formMethods.formState.isSubmitting ? (
            <SubmitButton />
          ) : (
            <ComponentFormLoadingButton
              text={props.submitButtonSubmittingText}
              className={props.submitButtonClassName}
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
}
