import ComponentThemeFormLoadingButton from './button/loadingButton';
import {
  FieldError,
  FieldErrors,
  FormProvider,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormSubmitButton from './button/submitButton';
import { useEffectAfterDidMount } from '@library/react/hooks';
import { useToast } from '@hooks/toast';

export type IFormFieldError = {
  title?: string;
} & FieldError;

type IComponentPropsI18 = {
  submitButtonSubmittingText?: string;
  submitButtonText?: string;
};

type IComponentProps = {
  children: React.ReactNode;
  formMethods: UseFormReturn<any>;
  hideSubmitButton?: boolean;
  submitButtonClassName?: string;
  submitButtonExtraClassName?: string;
  enterToSubmit?: true;
  i18?: IComponentPropsI18;
  onSubmit?: (data: any) => Promise<void> | void;
};

const ComponentThemeForm = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const { showToast } = useToast();

  const hasError =
    props.formMethods.formState.submitCount > 0 &&
    !props.formMethods.formState.isValid;

  useEffectAfterDidMount(() => {}, [props.formMethods.formState.errors]);

  const onError = (errors: FieldErrors) => {
    console.error(errors);

    if (hasError) {
      showToast({
        title: t('error'),
        content: t('warningAboutFormFieldError'),
        type: 'error',
      });
    }
  };

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
          props.formMethods.handleSubmit(props.onSubmit as any, onError)
        }
      >
        {props.children}
        <div className="submit-btn-div text-end mb-4">
          {props.hideSubmitButton ? null : props.formMethods.formState
              .isSubmitting ? (
            <ComponentThemeFormLoadingButton
              text={props.i18?.submitButtonSubmittingText ?? t('loading')}
              className={`${props.submitButtonClassName} ${props.submitButtonExtraClassName}`}
            />
          ) : (
            <ComponentThemeFormSubmitButton
              text={props.i18?.submitButtonText ?? t('save')}
              className={props.submitButtonClassName}
              extraClassName={props.submitButtonExtraClassName}
              isLoading={props.formMethods.formState.isSubmitting}
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
});

export default ComponentThemeForm;
