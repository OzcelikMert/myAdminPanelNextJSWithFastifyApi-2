import React from 'react';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import { IPageComponentAddState } from '@pages/component/add';
import { ComponentTypeId } from '@constants/componentTypes';

type IComponentProps = {
  componentTypes: IPageComponentAddState['componentTypes'];
  typeId: ComponentTypeId;
};

const ComponentPageComponentAddTabGeneral = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInput
            title={`${t('title')}*`}
            name="title"
            type="text"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInput title={`${t('key')}*`} name="key" type="text" />
        </div>
        <div className="col-md-7 mt-3">
          <ComponentThemeFormInputSelect
            title={`${t('typeId')}*`}
            name="typeId"
            placeholder={t('typeId')}
            options={props.componentTypes}
            valueAsNumber
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageComponentAddTabGeneral;
