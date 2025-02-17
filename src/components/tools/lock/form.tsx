import React from 'react';
import ComponentThemeForm from '@components/theme/form';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import { IComponentToolLockFormState } from '.';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  form: UseFormReturn<IComponentToolLockFormState>;
  onSubmit: (data: IComponentToolLockFormState) => void;
  isWrong?: boolean;
};

const ComponentToolLockForm = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <ComponentThemeForm
      formMethods={props.form}
      hideSubmitButton={true}
      onSubmit={(data) => props.onSubmit(data)}
    >
      <div className="row">
        <div className="col-md-12">
          <ComponentThemeFormInput
            title={t('password')}
            type="password"
            name="password"
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
    </ComponentThemeForm>
  );
});

export default ComponentToolLockForm;
