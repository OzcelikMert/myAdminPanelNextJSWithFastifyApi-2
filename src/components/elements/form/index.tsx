import ComponentFormLoadingButton from './button/loadingButton';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import React from 'react';

const SubmitButton = React.memo(
  (props: { text?: string; className?: string; extraClassName?: string, isLoading?: boolean }) => {
    return (
      <button
        type={'submit'}
        className={`btn-save ${props.className ?? 'btn btn-gradient-success'} ${props.extraClassName}`}
        disabled={props.isLoading}
      >
        {props.text}
      </button>
    );
  }
);

type IComponentPropsI18 = {
  submitButtonSubmittingText?: string
  submitButtonText?: string
}

type IComponentProps = {
  children: React.ReactNode;
  formMethods: UseFormReturn<any>;
  hideSubmitButton?: boolean;
  submitButtonClassName?: string;
  submitButtonExtraClassName?: string;
  enterToSubmit?: true;
  i18?: IComponentPropsI18
  onSubmit?: (data: any) => Promise<void> | void;
};

const ComponentForm = React.memo((props: IComponentProps) => {
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
              text={props.i18?.submitButtonText}
              className={props.submitButtonClassName}
              extraClassName={props.submitButtonExtraClassName}
              isLoading={props.formMethods.formState.isSubmitting}
            />
          ) : (
            <ComponentFormLoadingButton
              text={props.i18?.submitButtonSubmittingText}
              className={`${props.submitButtonClassName} ${props.submitButtonExtraClassName}`}
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
});

export default ComponentForm;
