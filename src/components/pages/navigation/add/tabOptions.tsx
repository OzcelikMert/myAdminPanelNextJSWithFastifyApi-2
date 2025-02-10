import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import ComponentThemeFormInputCheckbox from '@components/theme/form/inputs/checkbox';
import { IPageNavigationAddState } from '@pages/navigation/add';
import { StatusId } from '@constants/status';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  status: IPageNavigationAddState['status'];
  statusId: StatusId;
};

const ComponentPageNavigationAddTabOptions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInputSelect
            title={t('status')}
            name="statusId"
            options={props.status}
            valueAsNumber
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInput
            title={t('rank')}
            name="rank"
            type="number"
            required
          />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInputCheckbox title={t('primary')} name="isPrimary" />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInputCheckbox
            title={t('secondary')}
            name="isSecondary"
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageNavigationAddTabOptions;
