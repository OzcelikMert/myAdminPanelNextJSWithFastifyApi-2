import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormSelect from '@components/elements/form/input/select';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
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
            <ComponentThemeChooseImage
              name="logo"
              isMulti={false}
              isShowReviewImage={true}
              reviewImage={props.logo}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-4 mb-3">
          <ComponentFieldSet legend={t('logo') + ' - 2'}>
            <ComponentThemeChooseImage
              name="logoTwo"
              isMulti={false}
              isShowReviewImage={true}
              reviewImage={props.logoTwo}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-4 mb-3">
          <ComponentFieldSet legend={t('icon')}>
            <ComponentThemeChooseImage
              name="icon"
              isMulti={false}
              isShowReviewImage={true}
              reviewImage={props.icon}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('adminPanelLanguage').toCapitalizeCase()}
            name="panelLangId"
            isMulti={false}
            isSearchable={false}
            options={props.panelLanguages}
            value={props.panelLanguages.findSingle('value', props.panelLangId)}
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageSettingsGeneralTabGeneral;
