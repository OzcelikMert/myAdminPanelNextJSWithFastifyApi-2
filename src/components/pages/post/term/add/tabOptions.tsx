import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { StatusId } from '@constants/status';
import { IPagePostTermAddState } from '@pages/post/term/add';

type IComponentProps = {
  status: IPagePostTermAddState["status"]
  statusId: StatusId;
  isModal?: boolean
};

const ComponentPagePostTermAddTabOptions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className={`${props.isModal ? "col-md-12" : "col-md-7"} mb-3`}>
          <ComponentFormInputSelect
            title={t('status')}
            name="statusId"
            options={props.status}
            valueAsNumber
          />
        </div>
        <div className={`${props.isModal ? "col-md-12" : "col-md-7"} mb-3`}>
          <ComponentFormInput
            title={t('rank')}
            name="rank"
            type="number"
            required={true}
          />
        </div>
      </div>
    );
  }
);

export default ComponentPagePostTermAddTabOptions;
