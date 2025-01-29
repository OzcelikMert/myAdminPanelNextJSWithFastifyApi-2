import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentThemeChooseImageForm from '@components/theme/chooseImage/form';
import { IPageSettingsGeneralState } from '@pages/settings/general';

type IComponentProps = {
  panelLanguages: IPageSettingsGeneralState['panelLanguages'];
  panelLangId: number;
  logo?: string;
  logoTwo?: string;
  icon?: string;
};

const ComponentPageSettingsGeneralTabGeneral = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-4 mb-3">
          <ComponentFieldSet legend={t('logo')}>
            <ComponentThemeChooseImageForm
              name="logo"
              isShowReviewImage={true}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-4 mb-3">
          <ComponentFieldSet legend={t('logo') + ' - 2'}>
            <ComponentThemeChooseImageForm
              name="logoTwo"
              isShowReviewImage={true}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-4 mb-3">
          <ComponentFieldSet legend={t('icon')}>
            <ComponentThemeChooseImageForm
              name="icon"
              isShowReviewImage={true}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInputSelect
            title={t('adminPanelLanguage').toCapitalizeCase()}
            name="panelLangId"
            isMulti={false}
            isSearchable={false}
            options={props.panelLanguages}
            valueAsNumber
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageSettingsGeneralTabGeneral;
