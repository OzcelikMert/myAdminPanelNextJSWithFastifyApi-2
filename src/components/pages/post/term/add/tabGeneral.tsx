import React from 'react';
import ComponentFormInput from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormSelect from '@components/elements/form/input/select';
import { IPageNavigationAddState } from '@pages/navigation/add';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { PostTermTypeId } from '@constants/postTermTypes';

type IComponentProps = {
  termTypeId: PostTermTypeId;
  items: IPageNavigationAddState['items'];
  parentId?: string;
  image?: string;
  showParentSelect?: boolean;
  onChangeImage: (image: string) => void;
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
        <div className="col-md-7 mb-3">
          <ComponentThemeChooseImage
            {...props}
            onSelected={(images) => props.onChangeImage(images[0])}
            isMulti={false}
            selectedImages={props.image ? [props.image] : undefined}
            isShowReviewImage={true}
            reviewImage={props.image}
            reviewImageClassName={'post-image'}
          />
        </div>
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
            title={t('shortContent').toCapitalizeCase()}
            name="contents.shortContent"
            type="textarea"
          />
        </div>
        {props.showParentSelect ? (
          <div className="col-md-7 mb-3">
            <ComponentFormSelect
              title={getSelectMainInputTitle()}
              name="parentId"
              placeholder={t('chooseMainCategory')}
              options={props.items}
              value={props.items.findSingle('value', props.parentId || '')}
            />
          </div>
        ) : null}
      </div>
    );
  }
);

export default ComponentPagePostTermAddTabGeneral;
