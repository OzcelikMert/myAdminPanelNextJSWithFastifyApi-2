import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInput from '@components/elements/form/inputs/input';

type IComponentProps = {
};

const ComponentPageSettingsGeneralTabTools = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('head')}
            name="head"
            type="textarea"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('script')}
            name="script"
            type="textarea"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('googleAnalyticURL')}
            name="googleAnalyticURL"
            type="url"
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageSettingsGeneralTabTools;
