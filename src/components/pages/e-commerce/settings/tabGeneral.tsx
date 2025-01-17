import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormSelect from '@components/elements/form/input/select';
import { IPageECommerceSettingsState } from '@pages/e-commerce/settings';
import { CurrencyId } from '@constants/currencyTypes';

type IComponentProps = {
  currencyTypes: IPageECommerceSettingsState['currencyTypes'];
  currencyId: CurrencyId;
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
            options={props.currencyTypes}
            value={props.currencyTypes.findSingle('value', props.currencyId)}
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageECommerceSettingsTabGeneral;
