import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import ComponentFormInput from '@components/elements/form/inputs/input';
import ComponentFormInputCheckbox from '@components/elements/form/inputs/checkbox';
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
          <ComponentFormInputSelect
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
          <ComponentFormInputCheckbox title={t('default')} name="isDefault" />
        </div>
      </div>
    );
  }
);

export default ComponentPageLanguageAddTabOptions;
