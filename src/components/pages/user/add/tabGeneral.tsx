import React from 'react';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  isPasswordRequired?: boolean;
};

const ComponentPageUserAddTabGeneral = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('name')}*`}
          name="name"
          type="text"
          i18={{
            setErrorText: (errorCode) =>
              t(I18Util.getFormInputErrorText(errorCode), [t('name')]),
          }}
          required
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('email')}*`}
          name="email"
          type="email"
          i18={{
            setErrorText: (errorCode) =>
              t(I18Util.getFormInputErrorText(errorCode), [t('email')]),
          }}
          required
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('password')}*`}
          name="password"
          type="password"
          i18={{
            setErrorText: (errorCode) =>
              t(I18Util.getFormInputErrorText(errorCode), [t('password')]),
          }}
          required={props.isPasswordRequired}
        />
      </div>
    </div>
  );
});

export default ComponentPageUserAddTabGeneral;
