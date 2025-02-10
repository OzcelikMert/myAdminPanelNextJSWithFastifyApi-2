import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
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
          <ComponentThemeFormInputSelect
            title={t('currencyType')}
            name="eCommerce.currencyId"
            options={props.currencyTypes}
            valueAsNumber
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageECommerceSettingsTabGeneral;
