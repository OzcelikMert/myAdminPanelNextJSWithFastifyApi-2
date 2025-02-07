import React from 'react';
import ComponentFormInput from '@components/elements/form/inputs/input';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import { IPagePostAddState } from '@pages/post/add';
import ComponentThemeChooseImageForm from '@components/theme/chooseImage/form';
import { PostTermTypeId } from '@constants/postTermTypes';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  categoryTerms?: IPagePostAddState['categoryTerms'];
  tagTerms?: IPagePostAddState['tagTerms'];
  isIconActive?: boolean;
  showIconCheckBox?: boolean;
  showCategoryTermSelect?: boolean;
  showTagTermSelect?: boolean;
  index?: number;
  isECommerceVariation?: boolean;
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
            name={
              props.isECommerceVariation
                ? `eCommerce.variations.${props.index}.product.contents.icon`
                : `contents.icon`
            }
            type="text"
          />
        </div>
      ) : null}
      {!props.isIconActive ? (
        <div className="col-md-7 mb-3">
          <ComponentThemeChooseImageForm
            name={
              props.isECommerceVariation
                ? `eCommerce.variations.${props.index}.product.contents.image`
                : `contents.image`
            }
            reviewImageClassName={'post-image'}
          />
        </div>
      ) : null}
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={`${t('title')}*`}
          name={
            props.isECommerceVariation
              ? `eCommerce.variations.${props.index}.product.contents.title`
              : `contents.title`
          }
          type="text"
          i18={{
            setErrorText: (errorCode) =>
              t(I18Util.getFormInputErrorText(errorCode), [t('title')]),
          }}
          required
        />
      </div>
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={t('shortContent').toCapitalizeCase()}
          name={
            props.isECommerceVariation
              ? `eCommerce.variations.${props.index}.product.contents.shortContent`
              : `contents.shortContent`
          }
          type="textarea"
        />
      </div>

      {props.showCategoryTermSelect ? (
        <div className="col-md-7 mb-3">
          <div className="row">
            <div className="col-md-10">
              <ComponentFormInputSelect
                title={t('category')}
                name="categories"
                placeholder={t('chooseCategory').toCapitalizeCase()}
                isMulti
                closeMenuOnSelect={false}
                options={props.categoryTerms}
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

      {props.showTagTermSelect ? (
        <div className="col-md-7 mb-3">
          <div className="row">
            <div className="col-md-10">
              <ComponentFormInputSelect
                title={t('tag')}
                name="tags"
                placeholder={t('chooseTag').toCapitalizeCase()}
                isMulti
                closeMenuOnSelect={false}
                options={props.tagTerms}
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
