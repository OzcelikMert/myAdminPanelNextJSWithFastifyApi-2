import React from 'react';
import ComponentFormInput from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import ComponentFormSelect from '@components/elements/form/input/select';
import {
  IPageNavigationAddFormState,
  IPageNavigationAddState,
} from '@pages/navigation/add';

type IComponentProps = {
  state: IPageNavigationAddState;
  form: UseFormReturn<IPageNavigationAddFormState>;
};

const ComponentPageNavigationAddTabGeneral = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const formValues = props.form.getValues();

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('title')}*`}
            name="contents.title"
            type="text"
            required={true}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('url')}*`}
            name="contents.url"
            type="text"
            required={true}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('main')}
            name="parentId"
            placeholder={t('chooseMain')}
            options={props.state.items}
            value={props.state.items.findSingle(
              'value',
              formValues.parentId || ''
            )}
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageNavigationAddTabGeneral;
