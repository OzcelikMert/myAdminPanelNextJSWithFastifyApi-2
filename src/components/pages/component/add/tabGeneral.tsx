import React from 'react';
import ComponentFormInput from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormSelect from '@components/elements/form/input/select';
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
          <ComponentFormInput
            title={`${t('title')}*`}
            name="title"
            type="text"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput title={`${t('key')}*`} name="key" type="text" />
        </div>
        <div className="col-md-7 mt-3">
          <ComponentFormSelect
            title={`${t('typeId')}*`}
            name="typeId"
            placeholder={t('typeId')}
            options={props.componentTypes}
            value={props.componentTypes.findSingle('value', props.typeId)}
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageComponentAddTabGeneral;
