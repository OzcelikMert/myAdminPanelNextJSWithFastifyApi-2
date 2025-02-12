import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { StatusId } from '@constants/status';
import { IPagePostTermAddState } from '@pages/post/term/add';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  status: IPagePostTermAddState['status'];
  statusId: StatusId;
  isModal?: boolean;
};

const ComponentPagePostTermAddTabOptions = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className={`${props.isModal ? 'col-md-12' : 'col-md-7'} mb-3`}>
          <ComponentThemeFormInputSelect
            title={t('status')}
            name="statusId"
            options={props.status}
            valueAsNumber
          />
        </div>
        <div className={`${props.isModal ? 'col-md-12' : 'col-md-7'} mb-3`}>
          <ComponentThemeFormInput
            title={t('rank')}
            name="rank"
            type="number"
          />
        </div>
      </div>
    );
  }
);

export default ComponentPagePostTermAddTabOptions;
