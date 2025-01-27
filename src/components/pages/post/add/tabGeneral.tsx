import React from 'react';
import ComponentFormInput from '@components/elements/form/input/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormSelect from '@components/elements/form/input/select';
import { IPagePostAddState } from '@pages/post/add';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { PostTermTypeId } from '@constants/postTermTypes';

type IComponentProps = {
  categories?: IPagePostAddState['categories'];
  tags?: IPagePostAddState['tags'];
  image?: string;
  icon?: string;
  selectedCategories?: string[];
  selectedTags?: string[];
  isIconActive?: boolean;
  showIconCheckBox?: boolean;
  showCategorySelect?: boolean;
  showTagSelect?: boolean;
  isECommerceVariation?: boolean;
  index?: number;
  onChangeImage?: (image: string) => void;
  onChangeIsIconActive?: () => void;
  onClickShowTermModal?: (termTypeId: PostTermTypeId) => void;
};

const ComponentPagePostAddTabGeneral = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      {props.showIconCheckBox ? (
        <div className="col-md-7 mb-3">
          <div className="form-switch">
            <input
              checked={props.isIconActive}
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              onChange={(e) =>
                props.onChangeIsIconActive && props.onChangeIsIconActive()
              }
            />
            <label
              className="form-check-label ms-2"
              htmlFor="flexSwitchCheckDefault"
            >
              {t('icon')}
            </label>
          </div>
        </div>
      ) : null}
      {props.showIconCheckBox && props.isIconActive ? (
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('icon')}`}
            name="contents.icon"
            type="text"
          />
        </div>
      ) : null}
      {!props.isIconActive ? (
        <div className="col-md-7 mb-3">
          <ComponentThemeChooseImage
            name={
              props.isECommerceVariation
                ? `eCommerce.variations.${props.index}.itemId.contents.image`
                : `contents.image`
            }
            selectedImages={props.image ? [props.image] : undefined}
            isShowReviewImage={true}
            reviewImage={props.image}
            reviewImageClassName={'post-image'}
          />
        </div>
      ) : null}
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('title')}*`}
          name={
            props.isECommerceVariation
              ? `eCommerce.variations.${props.index}.itemId.contents.title`
              : `contents.title`
          }
          type="text"
          required={true}
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={t('shortContent').toCapitalizeCase()}
          name={
            props.isECommerceVariation
              ? `eCommerce.variations.${props.index}.itemId.contents.shortContent`
              : `contents.shortContent`
          }
          type="textarea"
        />
      </div>

      {props.showCategorySelect ? (
        <div className="col-md-7 mb-3">
          <div className="row">
            <div className="col-md-10">
              <ComponentFormSelect
                title={t('category')}
                name="categories"
                placeholder={t('chooseCategory').toCapitalizeCase()}
                isMulti
                closeMenuOnSelect={false}
                options={props.categories}
                value={props.categories?.filter((item) =>
                  props.selectedCategories?.includes(item.value)
                )}
              />
            </div>
            <div className="col-md-2 mt-2 m-md-auto text-end text-md-center">
              <button
                type={'button'}
                className="btn btn-gradient-success btn-lg"
                onClick={() =>
                  props.onClickShowTermModal &&
                  props.onClickShowTermModal(PostTermTypeId.Category)
                }
              >
                <i className="mdi mdi-plus"></i> {t('addNew')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {props.showTagSelect ? (
        <div className="col-md-7 mb-3">
          <div className="row">
            <div className="col-md-10">
              <ComponentFormSelect
                title={t('tag')}
                name="tags"
                placeholder={t('chooseTag').toCapitalizeCase()}
                isMulti
                closeMenuOnSelect={false}
                options={props.tags}
                value={props.tags?.filter((item) =>
                  props.selectedTags?.includes(item.value)
                )}
              />
            </div>
            <div className="col-md-2 mt-2 m-md-auto text-end text-md-center">
              <button
                type={'button'}
                className="btn btn-gradient-success btn-lg"
                onClick={() =>
                  props.onClickShowTermModal &&
                  props.onClickShowTermModal(PostTermTypeId.Tag)
                }
              >
                <i className="mdi mdi-plus"></i> {t('addNew')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default ComponentPagePostAddTabGeneral;
