import ComponentFormLoadingButton from './button/loadingButton';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import React from 'react';

const SubmitButton = React.memo(
  (props: { text?: string; className?: string; isLoading?: boolean }) => {
    return (
      <button
        type={'submit'}
        className={`btn-save ${props.className ?? 'btn btn-gradient-success'}`}
        disabled={props.isLoading}
      >
        {props.text}
      </button>
    );
  }
);

type IComponentProps<T = any> = {
  formMethods: UseFormReturn;
  hideSubmitButton?: boolean;
  submitButtonText?: string | React.ReactNode;
  submitButtonSubmittingText?: string;
  submitButtonClassName?: string;
  children: React.ReactNode;
  enterToSubmit?: true;
  onSubmit?: (data: T) => Promise<void> | void;
};

const ComponentForm = React.memo(<T,>(props: IComponentProps<T>) => {
  return (
    <FormProvider {...props.formMethods}>
      <form
        className="theme-form"
        onKeyDown={(event) => {
          if (!props.enterToSubmit && event.key === 'Enter')
            event.preventDefault();
        }}
        onSubmit={
          props.onSubmit &&
          props.formMethods.handleSubmit(props.onSubmit as any)
        }
      >
        {props.children}
        <div className="submit-btn-div text-end mb-4">
          {props.hideSubmitButton ? null : !props.formMethods.formState
              .isSubmitting ? (
            <SubmitButton
              text={props.submitButtonSubmittingText}
              className={props.submitButtonClassName}
              isLoading={props.formMethods.formState.isSubmitting}
            />
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
}) as <T>(props: IComponentProps<T>) => React.ReactNode;

export default ComponentForm;
