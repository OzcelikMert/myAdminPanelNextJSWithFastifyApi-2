import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentFormInput from '@components/elements/form/input/input';
import { StatusId } from '@constants/status';
import { IPageLoginState } from '@pages/login';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import React from 'react';

type IComponentProps = {
  state: IPageLoginState;
};

const ComponentPageLoginForm = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      <div className="col-md-12 mb-3">
        <ComponentFormInput title={t('email')} type="email" name="email" />
      </div>
      <div className="col-md-12 mb-3">
        <ComponentFormInput
          title={t('password')}
          type="password"
          name="password"
        />
      </div>
      <div className="col-md-12 mb-3">
        <ComponentFormCheckBox title={t('keepMe')} name="keepMe" />
      </div>
      <div className="col-md-12">
        {props.state.isWrong ? (
          <p className="fw-bold text-danger">{t('wrongEmailOrPassword')}</p>
        ) : null}
        {props.state.user?.statusId == StatusId.Banned && (
          <div>
            <p className="fw-bold text-danger">{t('yourAccountIsBanned')}</p>
            <p className="fw-bold text-danger">
              {t('banDateEnd')}:
              <span className="text-muted ms-1">
                {new Date(
                  props.state.user?.banDateEnd || ''
                ).toLocaleDateString()}
              </span>
            </p>
            <p className="fw-bold text-danger">
              {t('banComment')}:
              <span className="text-muted ms-1">
                {props.state.user?.banComment}
              </span>
            </p>
          </div>
        )}
        {props.state.user?.statusId == StatusId.Pending && (
          <div>
            <p className="fw-bold text-danger">{t('yourAccountIsPending')}</p>
          </div>
        )}
        {props.state.user?.statusId == StatusId.Disabled && (
          <div>
            <p className="fw-bold text-danger">{t('yourAccountIsDisabled')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ComponentPageLoginForm;
