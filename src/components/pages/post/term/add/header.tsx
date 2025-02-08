import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeLanguageSelector from '@components/theme/languageSelector';
import { IPagePostTermAddState } from '@pages/post/term/add';
import ComponentToolTip from '@components/elements/tooltip';

type IComponentProps = {
  langId: IPagePostTermAddState['langId'];
  item: IPagePostTermAddState['item'];
  views?: number;
  showLanguageSelector?: boolean;
  onNavigatePage: () => void;
  onChangeLanguage: (_id: string) => void;
};

const ComponentPagePostTermAddHeader = React.memo((props: IComponentProps) => {
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
            <div className="col-md-3 mb-md-0 mb-4">
              <ComponentToolTip message={t('views')}>
                <label className="badge badge-gradient-primary w-100 p-2 fs-6 rounded-3">
                  <i className="mdi mdi-eye"></i> {props.views || 0}
                </label>
              </ComponentToolTip>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {props.showLanguageSelector ? (
            <ComponentThemeLanguageSelector
              onChange={(item) => props.onChangeLanguage(item.value._id)}
              selectedLangId={props.langId}
              alternates={props.item?.alternates}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default ComponentPagePostTermAddHeader;
