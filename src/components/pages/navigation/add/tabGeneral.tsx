import React from 'react';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import { IPageNavigationAddState } from '@pages/navigation/add';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  items: IPageNavigationAddState['items'];
  parentId?: string;
};

const ComponentPageNavigationAddTabGeneral = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInput
            title={`${t('title')}*`}
            name="contents.title"
            type="text"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInput
            title={`${t('url')}*`}
            name="contents.url"
            type="text"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInputSelect
            title={t('main')}
            name="parentId"
            placeholder={t('chooseMain')}
            options={props.items}
          />
        </div>
      </div>
    );
  }
);

export default ComponentPageNavigationAddTabGeneral;
