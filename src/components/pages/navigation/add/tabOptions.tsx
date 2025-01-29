import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import ComponentFormInput from '@components/elements/form/inputs/input';
import ComponentFormInputCheckbox from '@components/elements/form/inputs/checkbox';
import {
  IPageNavigationAddState,
} from '@pages/navigation/add';
import { StatusId } from '@constants/status';

type IComponentProps = {
  status: IPageNavigationAddState["status"]
  statusId: StatusId;
};

const ComponentPageNavigationAddTabOptions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormInputSelect
            title={t('status')}
            name="statusId"
            options={props.status}
            valueAsNumber
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('rank')}
            name="rank"
            type="number"
            required={true}
          />
        </div>
        <div className="col-md-7">
          <ComponentFormInputCheckbox title={t('primary')} name="isPrimary" />
        </div>
        <div className="col-md-7">
          <ComponentFormInputCheckbox title={t('secondary')} name="isSecondary" />
        </div>
      </div>
    );
  }
);

export default ComponentPageNavigationAddTabOptions;
