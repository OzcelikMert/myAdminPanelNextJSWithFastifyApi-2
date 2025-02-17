import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { ISettingContactModel } from 'types/models/setting.model';

type IComponentProps = {
  contact?: ISettingContactModel;
};

const ComponentPageSettingsGeneralTabContact = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7">
          <ComponentThemeFormInput
            title={t('email')}
            name="contact.email"
            type="email"
          />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInput
            title={t('phone')}
            name="contact.phone"
            type="tel"
          />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInput
            title={t('address')}
            name="contact.address"
            type="text"
          />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInput
            title={t('addressMap')}
            name="contact.addressMap"
            type="text"
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageSettingsGeneralTabContact;
