import React from 'react';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import { IPageNavigationAddState } from '@pages/navigation/add';
import ComponentThemeFormSelectImage from '@components/theme/form/inputs/selectImage';
import { PostTermTypeId } from '@constants/postTermTypes';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  termTypeId: PostTermTypeId;
  items: IPageNavigationAddState['items'];
  parentId?: string;
  image?: string;
  showParentSelect?: boolean;
  isModal?: boolean;
};

const ComponentPagePostTermAddTabGeneral = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    const getSelectMainInputTitle = () => {
      let title = t('main');

      switch (props.termTypeId) {
        case PostTermTypeId.Category:
          title = `${t('main')} ${t('category')}`;
          break;
        case PostTermTypeId.Variations:
          title = `${t('attribute')}`;
          break;
      }

      return title;
    };

    return (
      <div className="row">
        <div className={`${props.isModal ? 'col-md-12' : 'col-md-7'} mb-3`}>
          <ComponentThemeFormSelectImage
            name="contents.image"
            reviewImageClassName={'post-image'}
          />
        </div>
        <div className={`${props.isModal ? 'col-md-12' : 'col-md-7'} mb-3`}>
          <ComponentThemeFormInput
            title={`${t('title')}*`}
            name="contents.title"
            type="text"
          />
        </div>
        <div className={`${props.isModal ? 'col-md-12' : 'col-md-7'} mb-3`}>
          <ComponentThemeFormInput
            title={t('shortContent').toCapitalizeCase()}
            name="contents.shortContent"
            type="textarea"
          />
        </div>
        {props.showParentSelect ? (
          <div className={`${props.isModal ? 'col-md-12' : 'col-md-7'} mb-3`}>
            <ComponentThemeFormInputSelect
              title={getSelectMainInputTitle()}
              name="parentId"
              placeholder={t('chooseMainCategory')}
              options={props.items}
            />
          </div>
        ) : null}
      </div>
    );
  }
);

export default ComponentPagePostTermAddTabGeneral;
