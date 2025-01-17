import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormSelect from '@components/elements/form/input/select';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import { IPageLanguageAddState } from '@pages/language/add';
import { StatusId } from '@constants/status';

type IComponentProps = {
  status: IPageLanguageAddState['status'];
  statusId: StatusId;
};

const ComponentPageLanguageAddTabOptions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('status')}
            options={props.status}
            name="statusId"
            value={props.status?.findSingle('value', props.statusId)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('rank')}*`}
            name="rank"
            type="number"
            required={true}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormCheckBox title={t('default')} name="isDefault" />
        </div>
      </div>
    );
  }
);

export default ComponentPageLanguageAddTabOptions;
