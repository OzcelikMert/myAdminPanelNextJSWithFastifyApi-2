import React from 'react';
import ComponentForm from '@components/elements/form';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import { IComponentToolLockFormState } from '.';

type IComponentProps = {
  form: UseFormReturn<IComponentToolLockFormState>;
  onSubmit: (data: IComponentToolLockFormState) => void;
  isWrong?: boolean;
}

const ComponentToolLockForm = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <ComponentForm
      formMethods={props.form}
      hideSubmitButton={true}
      onSubmit={(data) => props.onSubmit(data)}
    >
      <div className="row">
        <div className="col-md-12 mb-3">
          <ComponentFormInput
            title={t('password')}
            type="password"
            name="password"
            required={true}
          />
        </div>
        <div className="col-md-12">
          {props.form.formState.isSubmitting ? (
            <button
              className="btn btn-outline-light btn-lg font-weight-medium auth-form-btn w-100"
              disabled={true}
              type={'button'}
            >
              <i className="fa fa-spinner fa-spin me-1"></i>
              {t('loading') + '...'}
            </button>
          ) : (
            <button
              type="submit"
              className={`btn btn-outline-${props.isWrong ? 'danger' : 'info'} btn-lg font-weight-medium auth-form-btn w-100`}
            >
              {t('login')}
            </button>
          )}
        </div>
      </div>
    </ComponentForm>
  );
});

export default ComponentToolLockForm;