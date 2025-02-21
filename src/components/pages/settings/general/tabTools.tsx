import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';

type IComponentProps = {};

const ComponentPageSettingsGeneralTabTools = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7">
          <ComponentThemeFormInput
            title={t('head')}
            name="head"
            type="textarea"
          />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInput
            title={t('script')}
            name="script"
            type="textarea"
          />
        </div>
        <div className="col-md-7">
          <ComponentThemeFormInput
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
