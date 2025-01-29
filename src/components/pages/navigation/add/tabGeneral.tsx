import React from 'react';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import { IPageNavigationAddState } from '@pages/navigation/add';

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
          <ComponentFormInput
            title={`${t('title')}*`}
            name="contents.title"
            type="text"
            required={true}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('url')}*`}
            name="contents.url"
            type="text"
            required={true}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInputSelect
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
