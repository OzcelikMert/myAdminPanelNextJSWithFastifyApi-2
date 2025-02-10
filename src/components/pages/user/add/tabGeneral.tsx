import React from 'react';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
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
        <ComponentThemeFormInput
          title={`${t('name')}*`}
          name="name"
          type="text"
          required
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentThemeFormInput
          title={`${t('email')}*`}
          name="email"
          type="email"
          required
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentThemeFormInput
          title={`${t('password')}*`}
          name="password"
          type="password"
          required={props.isPasswordRequired}
        />
      </div>
    </div>
  );
});

export default ComponentPageUserAddTabGeneral;
