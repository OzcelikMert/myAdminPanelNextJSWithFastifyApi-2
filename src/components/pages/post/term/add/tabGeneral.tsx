import React from 'react';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import { IPageNavigationAddState } from '@pages/navigation/add';
import ComponentThemeChooseImageForm from '@components/theme/chooseImage/form';
import { PostTermTypeId } from '@constants/postTermTypes';

type IComponentProps = {
  termTypeId: PostTermTypeId;
  items: IPageNavigationAddState['items'];
  parentId?: string;
  image?: string;
  showParentSelect?: boolean;
  isModal?: boolean
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
        <div className={`${props.isModal ? "col-md-12" : "col-md-7"} mb-3`}>
          <ComponentThemeChooseImageForm
            name="contents.image"
            isShowReviewImage={true}
            reviewImageClassName={'post-image'}
          />
        </div>
        <div className={`${props.isModal ? "col-md-12" : "col-md-7"} mb-3`}>
          <ComponentFormInput
            title={`${t('title')}*`}
            name="contents.title"
            type="text"
            required={true}
          />
        </div>
        <div className={`${props.isModal ? "col-md-12" : "col-md-7"} mb-3`}>
          <ComponentFormInput
            title={t('shortContent').toCapitalizeCase()}
            name="contents.shortContent"
            type="textarea"
          />
        </div>
        {props.showParentSelect ? (
          <div className={`${props.isModal ? "col-md-12" : "col-md-7"} mb-3`}>
            <ComponentFormInputSelect
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
