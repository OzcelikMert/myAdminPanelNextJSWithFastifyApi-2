import React from 'react';
import ComponentThemeLanguageSelector from '@components/theme/languageSelector';
import { IPageSettingsSEOState } from '@pages/settings/seo';

type IComponentProps = {
  langId: IPageSettingsSEOState['langId'];
  item: IPageSettingsSEOState['item'];
  onChangeLanguage: (_id: string) => void;
};

const ComponentPageSettingsSEOHeader = React.memo((props: IComponentProps) => {
  return (
    <div className="col-md-12">
      <div className="row">
        <div className="col-md-6 align-content-center"></div>
        <div className="col-md-6">
          <ComponentThemeLanguageSelector
            onChange={(item) => props.onChangeLanguage(item._id)}
            selectedLangId={props.langId}
            alternates={props.item?.seoContentAlternates}
          />
        </div>
      </div>
    </div>
  );
});

export default ComponentPageSettingsSEOHeader;
