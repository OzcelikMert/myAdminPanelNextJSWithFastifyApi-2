import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import ComponentFormInput from '@components/elements/form/inputs/input';
import ComponentFormInputCheckbox from '@components/elements/form/inputs/checkbox';
import { IPageLanguageAddState } from '@pages/language/add';
import { StatusId } from '@constants/status';
import { I18Util } from '@utils/i18.util';

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
            name="statusId"
            options={props.status}
            valueAsNumber
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('rank')}*`}
            name="rank"
            type="number"
            i18={{
              setErrorText: (errorCode) =>
                t(I18Util.getFormInputErrorText(errorCode), [t('rank')]),
            }}
            required
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
