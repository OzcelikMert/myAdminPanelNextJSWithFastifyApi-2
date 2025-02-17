import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPageNavigationAddState } from '@pages/navigation/add';
import ComponentThemeLanguageSelector from '@components/theme/languageSelector';

type IComponentProps = {
  langId: IPageNavigationAddState['langId'];
  item: IPageNavigationAddState['item'];
  showLanguageSelector?: boolean;
  onNavigatePage: () => void;
  onChangeLanguage: (_id: string) => void;
};

const ComponentPageNavigationAddHeader = React.memo(
  (props: IComponentProps) => {
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
                onChange={(item) => props.onChangeLanguage(item._id)}
                selectedLangId={props.langId}
                alternates={props.item?.alternates}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPageNavigationAddHeader;
