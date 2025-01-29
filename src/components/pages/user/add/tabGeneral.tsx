import React from 'react';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

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
          required={true}
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('email')}*`}
          name="email"
          type="email"
          required={true}
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInput
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
