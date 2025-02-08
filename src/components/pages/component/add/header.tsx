import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPageComponentAddState } from '@pages/component/add';
import ComponentThemeLanguageSelector from '@components/theme/languageSelector';

type IComponentProps = {
  langId: IPageComponentAddState['langId'];
  item: IPageComponentAddState['item'];
  showLanguageSelector?: boolean;
  onNavigatePage: () => void;
  onChangeLanguage: (_id: string) => void;
};

const ComponentPageComponentAddHeader = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="col-md-12">
      <div className="row">
        <div className="col-md-6 align-content-center">
          <div className="row">
            <div className="col-md-3 mb-md-0 mb-4">
              <button
                className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
                onClick={() => props.onNavigatePage()}
              >
                <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {props.showLanguageSelector ? (
            <ComponentThemeLanguageSelector
              onChange={(item) => props.onChangeLanguage(item.value._id)}
              selectedLangId={props.langId}
              alternates={props.item?.elements.map(
                (item) => item.alternates ?? []
              )}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default ComponentPageComponentAddHeader;
