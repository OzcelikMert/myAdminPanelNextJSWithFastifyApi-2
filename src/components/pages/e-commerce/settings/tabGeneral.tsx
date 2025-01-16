import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { UseFormReturn } from 'react-hook-form';
import ComponentFormSelect from '@components/elements/form/input/select';
import {
  IPageECommerceSettingsFormState,
  IPageECommerceSettingsState,
} from '@pages/e-commerce/settings';

type IComponentProps = {
  state: IPageECommerceSettingsState;
  form: UseFormReturn<IPageECommerceSettingsFormState>;
};

const ComponentPageECommerceSettingsTabGeneral = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('currencyType')}
            isMulti={false}
            name="eCommerce.currencyId"
            isSearchable={false}
            options={props.state.currencyTypes}
            value={props.state.currencyTypes.findSingle(
              'value',
              props.form.getValues().eCommerce.currencyId
            )}
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageECommerceSettingsTabGeneral;
