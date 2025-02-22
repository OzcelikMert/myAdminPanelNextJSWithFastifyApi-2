import ComponentThemeFormInputCheckbox from '@components/theme/form/inputs/checkbox';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { StatusId } from '@constants/status';
import { IPageLoginState } from '@pages/login';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import React from 'react';

type IComponentProps = {
  item: IPageLoginState['item'];
  isWrong: IPageLoginState['isWrong'];
};

const ComponentPageLoginForm = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      <div className="col-md-12">
        <ComponentThemeFormInput title={t('username')} type="text" name="username" />
      </div>
      <div className="col-md-12">
        <ComponentThemeFormInput
          title={t('password')}
          type="password"
          name="password"
        />
      </div>
      <div className="col-md-12">
        <ComponentThemeFormInputCheckbox title={t('keepMe')} name="keepMe" />
      </div>
      <div className="col-md-12">
        {props.isWrong ? (
          <p className="fw-bold text-danger">{t('wrongEmailOrPassword')}</p>
        ) : null}
        {props.item?.statusId == StatusId.Banned && (
          <div>
            <p className="fw-bold text-danger">{t('yourAccountIsBanned')}</p>
            <p className="fw-bold text-danger">
              {t('banDateEnd')}:
              <span className="text-muted ms-1">
                {new Date(props.item?.banDateEnd || '').toLocaleDateString()}
              </span>
            </p>
            <p className="fw-bold text-danger">
              {t('banComment')}:
              <span className="text-muted ms-1">{props.item?.banComment}</span>
            </p>
          </div>
        )}
        {props.item?.statusId == StatusId.Pending && (
          <div>
            <p className="fw-bold text-danger">{t('yourAccountIsPending')}</p>
          </div>
        )}
        {props.item?.statusId == StatusId.Disabled && (
          <div>
            <p className="fw-bold text-danger">{t('yourAccountIsDisabled')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ComponentPageLoginForm;
