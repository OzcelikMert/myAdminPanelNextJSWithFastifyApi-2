import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { ISettingContactModel } from 'types/models/setting.model';

type IComponentProps = {
  contact?: ISettingContactModel;
};

const ComponentPageSettingsGeneralTabContact = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('email')}
            name="contact.email"
            type="email"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('phone')}
            name="contact.phone"
            type="tel"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('address')}
            name="contact.address"
            type="text"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
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
