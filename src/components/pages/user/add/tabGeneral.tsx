import React from 'react';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

type IComponentProps = {
  isPasswordRequired?: boolean;
};

const ComponentPageUserAddTabGeneral = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      <div className="col-md-7">
        <ComponentThemeFormInput
          title={`${t('name')}*`}
          name="name"
          type="text"
        />
      </div>
      <div className="col-md-7">
        <ComponentThemeFormInput
          title={`${t('username')}*`}
          name="username"
          type="text"
          errorInfoText={t('allowedCharsWithVariable', [
            "'a-z', '0-9', '_', '-'",
          ])}
        />
      </div>
      <div className="col-md-7">
        <ComponentThemeFormInput
          title={`${t('email')}*`}
          name="email"
          type="email"
        />
      </div>
      <div className="col-md-7">
        <ComponentThemeFormInput
          title={`${t('password')}*`}
          name="password"
          type="password"
        />
      </div>
    </div>
  );
});

export default ComponentPageUserAddTabGeneral;
