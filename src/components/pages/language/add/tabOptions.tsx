import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { IPageLanguageAddState } from '@pages/language/add';
import { StatusId } from '@constants/status';
import { I18Util } from '@utils/i18.util';
import ComponentThemeFormInputSwitch from '@components/theme/form/inputs/switch';

type IComponentProps = {
  status: IPageLanguageAddState['status'];
  statusId: StatusId;
  disableIsDefault?: boolean
};

const ComponentPageLanguageAddTabOptions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7">
          <ComponentThemeFormInputSelect
            title={t('status')}
            name="statusId"
            options={props.status}
            valueAsNumber
          />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInput
            title={`${t('rank')}*`}
            name="rank"
            type="number"
          />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInputSwitch title={t('default')} name="isDefault" disabled={props.disableIsDefault}/>
        </div>
      </div>
    );
  }
);

export default ComponentPageLanguageAddTabOptions;
