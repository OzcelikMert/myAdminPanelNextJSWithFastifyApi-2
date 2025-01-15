import { FormEvent, useEffect, useReducer, useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import moment from 'moment';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { PostTermService } from '@services/postTerm.service';
import { PostService } from '@services/post.service';
import {
  IPostGetResultService,
  IPostUpdateWithIdParamService,
} from 'types/services/post.service';
import ComponentToolTip from '@components/elements/tooltip';
import dynamic from 'next/dynamic';
import { ProductTypeId, productTypes } from '@constants/productTypes';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import ComponentPagePostAddECommerce from '@components/pages/post/add/eCommerce';
import ComponentPagePostAddButton from '@components/pages/post/add/button';
import ComponentPagePostAddBeforeAndAfter from '@components/pages/post/add/beforeAndAfter';
import ComponentPagePostAddChooseCategory from '@components/pages/post/add/chooseCategory';
import ComponentPagePostAddChooseTag from '@components/pages/post/add/chooseTag';
import { PermissionUtil, PostPermissionMethod } from '@utils/permission.util';
import { PostTypeId } from '@constants/postTypes';
import { PostUtil } from '@utils/post.util';
import { AttributeTypeId, attributeTypes } from '@constants/attributeTypes';
import { PageTypeId, pageTypes } from '@constants/pageTypes';
import { ComponentUtil } from '@utils/component.util';
import { StatusId } from '@constants/status';
import { PostTermTypeId } from '@constants/postTermTypes';
import { ComponentService } from '@services/component.service';
import ComponentPagePostAddComponent from '@components/pages/post/add/component';
import { ComponentTypeId } from '@constants/componentTypes';
import { UserService } from '@services/user.service';
import { UserRoleId } from '@constants/userRoles';
import { RouteUtil } from '@utils/route.util';
import ComponentToast from '@components/elements/toast';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormReducer } from '@library/react/handles/form';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import ComponentThemeContentLanguage from '@components/theme/contentLanguage';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';

const ComponentThemeRichTextBox = dynamic(
  () => import('@components/theme/richTextBox'),
  { ssr: false }
);

export type IPostAddComponentState = {
  authors: IThemeFormSelectData<string>[];
  pageTypes: IThemeFormSelectData<PageTypeId>[];
  attributeTypes: IThemeFormSelectData<AttributeTypeId>[];
  productTypes: IThemeFormSelectData<ProductTypeId>[];
  components: IThemeFormSelectData<string>[];
  categories: IThemeFormSelectData<string>[];
  tags: IThemeFormSelectData<string>[];
  attributes: IThemeFormSelectData<string>[];
  variations: (IThemeFormSelectData<string> & { parentId: string })[];
  status: IThemeFormSelectData<StatusId>[];
  mainTabActiveKey: string;
  item?: IPostGetResultService;
  isIconActive: boolean;
  langId: string;
  isItemLoading: boolean;
};

const initialState: IPostAddComponentState = {
  authors: [],
  pageTypes: [],
  attributeTypes: [],
  productTypes: [],
  components: [],
  categories: [],
  tags: [],
  attributes: [],
  variations: [],
  status: [],
  mainTabActiveKey: 'general',
  isIconActive: false,
  langId: '',
  isItemLoading: false,
};

type IActionPayloadSetTerms = {
  categories: IPostAddComponentState['categories'];
  tags: IPostAddComponentState['tags'];
  attributes: IPostAddComponentState['attributes'];
  variations: IPostAddComponentState['variations'];
};

export enum PostAddActionTypes {
  SET_AUTHORS,
  SET_PAGE_TYPES,
  SET_ATTRIBUTE_TYPES,
  SET_PRODUCT_TYPES,
  SET_COMPONENTS,
  SET_CATEGORIES,
  SET_TAGS,
  SET_ATTRIBUTES,
  SET_VARIATIONS,
  SET_STATUS,
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_ITEM,
  SET_IS_ICON_ACTIVE,
  SET_LANG_ID,
  SET_TERMS,
  SET_IS_ITEM_LOADING,
}

export type IPostAddAction =
  | {
      type: PostAddActionTypes.SET_AUTHORS;
      payload: IPostAddComponentState['authors'];
    }
  | {
      type: PostAddActionTypes.SET_PAGE_TYPES;
      payload: IPostAddComponentState['pageTypes'];
    }
  | {
      type: PostAddActionTypes.SET_ATTRIBUTE_TYPES;
      payload: IPostAddComponentState['attributeTypes'];
    }
  | {
      type: PostAddActionTypes.SET_PRODUCT_TYPES;
      payload: IPostAddComponentState['productTypes'];
    }
  | {
      type: PostAddActionTypes.SET_COMPONENTS;
      payload: IPostAddComponentState['components'];
    }
  | {
      type: PostAddActionTypes.SET_CATEGORIES;
      payload: IPostAddComponentState['categories'];
    }
  | {
      type: PostAddActionTypes.SET_TAGS;
      payload: IPostAddComponentState['tags'];
    }
  | {
      type: PostAddActionTypes.SET_ATTRIBUTES;
      payload: IPostAddComponentState['attributes'];
    }
  | {
      type: PostAddActionTypes.SET_VARIATIONS;
      payload: IPostAddComponentState['variations'];
    }
  | {
      type: PostAddActionTypes.SET_STATUS;
      payload: IPostAddComponentState['status'];
    }
  | {
      type: PostAddActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IPostAddComponentState['mainTabActiveKey'];
    }
  | {
      type: PostAddActionTypes.SET_ITEM;
      payload: IPostAddComponentState['item'];
    }
  | {
      type: PostAddActionTypes.SET_IS_ICON_ACTIVE;
      payload: IPostAddComponentState['isIconActive'];
    }
  | {
      type: PostAddActionTypes.SET_LANG_ID;
      payload: IPostAddComponentState['langId'];
    }
  | { type: PostAddActionTypes.SET_TERMS; payload: IActionPayloadSetTerms }
  | {
      type: PostAddActionTypes.SET_IS_ITEM_LOADING;
      payload: IPostAddComponentState['isItemLoading'];
    };

const reducer = (
  state: IPostAddComponentState,
  action: IPostAddAction
): IPostAddComponentState => {
  switch (action.type) {
    case PostAddActionTypes.SET_AUTHORS:
      return { ...state, authors: action.payload };
    case PostAddActionTypes.SET_PAGE_TYPES:
      return { ...state, pageTypes: action.payload };
    case PostAddActionTypes.SET_ATTRIBUTE_TYPES:
      return { ...state, attributeTypes: action.payload };
    case PostAddActionTypes.SET_PRODUCT_TYPES:
      return { ...state, productTypes: action.payload };
    case PostAddActionTypes.SET_COMPONENTS:
      return { ...state, components: action.payload };
    case PostAddActionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case PostAddActionTypes.SET_TAGS:
      return { ...state, tags: action.payload };
    case PostAddActionTypes.SET_ATTRIBUTES:
      return { ...state, attributes: action.payload };
    case PostAddActionTypes.SET_VARIATIONS:
      return { ...state, variations: action.payload };
    case PostAddActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case PostAddActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case PostAddActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    case PostAddActionTypes.SET_IS_ICON_ACTIVE:
      return { ...state, isIconActive: action.payload };
    case PostAddActionTypes.SET_LANG_ID:
      return { ...state, langId: action.payload };
    case PostAddActionTypes.SET_TERMS:
      return {
        ...state,
        categories: action.payload.categories,
        tags: action.payload.tags,
        attributes: action.payload.attributes,
        variations: action.payload.variations,
      };
    case PostAddActionTypes.SET_IS_ITEM_LOADING:
      return { ...state, isItemLoading: action.payload };
    default:
      return state;
  }
};

export type IPostAddComponentFormState = IPostUpdateWithIdParamService;

const initialFormState: IPostAddComponentFormState = {
  _id: '',
  typeId: PostTypeId.Blog,
  statusId: StatusId.Active,
  rank: 0,
  isFixed: false,
  contents: {
    langId: '',
    title: '',
  },
};

type IPageQueries = {
  _id?: string;
  postTypeId?: PostTypeId;
};

export default function PagePostAdd() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const queries = router.query as IPageQueries;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    langId: mainLangId,
  });
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer<IPostAddComponentFormState>({
      ...initialFormState,
      typeId: Number(queries.postTypeId ?? PostTypeId.Blog),
      _id: queries._id ?? '',
    });
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const mainTitleRef = useRef<string>('');

  useDidMount(() => {
    init();
    return () => {
      abortController.abort();
    };
  });

  useEffectAfterDidMount(() => {
    if (isPageLoaded) {
      appDispatch(setIsPageLoadingState(false));
    }
  }, [isPageLoaded]);

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    const methodType = formState._id
      ? PostPermissionMethod.UPDATE
      : PostPermissionMethod.ADD;

    const minPermission = PermissionUtil.getPostPermission(
      formState.typeId,
      methodType
    );

    if (
      PermissionUtil.checkAndRedirect({
        minPermission,
        router,
        sessionAuth,
        t,
      })
    ) {
      if (
        ![
          PostTypeId.Slider,
          PostTypeId.Service,
          PostTypeId.Testimonial,
        ].includes(formState.typeId)
      ) {
        await getTerms();
      }
      
      if ([PostTypeId.Page].includes(formState.typeId)) {
        await getComponents();
        getPageTypes();
      }
      if ([PostTypeId.Product].includes(formState.typeId)) {
        getAttributeTypes();
        getProductTypes();
      }
      if ([PostTypeId.BeforeAndAfter].includes(formState.typeId)) {
        setFormState({
          beforeAndAfter: {
            imageBefore: '',
            imageAfter: '',
            images: [],
          },
        });
      }
      await getAuthors();
      getStatus();
      if (formState._id) {
        await getItem();
      }
      setPageTitle();
      setIsPageLoaded(true);
    }
  };

  const onChangeLanguage = async (langId: string) => {
    dispatch({ type: PostAddActionTypes.SET_IS_ITEM_LOADING, payload: true });
    dispatch({ type: PostAddActionTypes.SET_LANG_ID, payload: langId });
    await getItem(langId);
    dispatch({ type: PostAddActionTypes.SET_IS_ITEM_LOADING, payload: false });
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = PostUtil.getPageTitles({
      t: t,
      postTypeId: formState.typeId,
    });

    if (formState._id) {
      titles.push({ title: t('edit') });
      titles.push({ title: mainTitleRef.current });
    } else {
      titles.push({ title: t('add') });
    }

    appDispatch(setBreadCrumbState(titles));
  };

  const getAttributeTypes = () => {
    dispatch({
      type: PostAddActionTypes.SET_ATTRIBUTE_TYPES,
      payload: attributeTypes.map((attribute) => ({
        label: t(attribute.langKey),
        value: attribute.id,
      })),
    });
  };

  const getProductTypes = () => {
    dispatch({
      type: PostAddActionTypes.SET_PRODUCT_TYPES,
      payload: productTypes.map((product) => ({
        label: t(product.langKey),
        value: product.id,
      })),
    });
    setFormState({
      eCommerce: {
        ...formState.eCommerce,
        typeId: ProductTypeId.SimpleProduct,
        images: [],
      },
    });
  };

  const getPageTypes = () => {
    dispatch({
      type: PostAddActionTypes.SET_PAGE_TYPES,
      payload: pageTypes.map((pageType) => ({
        label: t(pageType.langKey),
        value: pageType.id,
      })),
    });
    setFormState({
      pageTypeId: PageTypeId.Default,
    });
  };

  const getStatus = () => {
    dispatch({
      type: PostAddActionTypes.SET_STATUS,
      payload: ComponentUtil.getStatusForSelect(
        [StatusId.Active, StatusId.InProgress, StatusId.Pending],
        t
      ),
    });
  };

  const getAuthors = async () => {
    const serviceResult = await UserService.getMany(
      {
        permissions: [
          ...PermissionUtil.getPostPermission(
            formState.typeId,
            PostPermissionMethod.UPDATE
          ).permissionId,
        ],
      },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      let newItems = serviceResult.data;
      newItems = newItems.filter(
        (item) =>
          item.roleId != UserRoleId.SuperAdmin &&
          item._id != sessionAuth?.user.userId
      );
      dispatch({
        type: PostAddActionTypes.SET_AUTHORS,
        payload: newItems.map((author) => {
          return {
            value: author._id,
            label: author.email,
          };
        }),
      });
    }
  };

  const getComponents = async () => {
    const serviceResult = await ComponentService.getMany(
      {
        langId: mainLangId,
        typeId: ComponentTypeId.Private,
      },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: PostAddActionTypes.SET_COMPONENTS,
        payload: serviceResult.data.map((component) => {
          return {
            value: component._id,
            label: component.title,
          };
        }),
      });
    }
  };

  const getTerms = async () => {
    const serviceResult = await PostTermService.getMany(
      {
        postTypeId: formState.typeId,
        langId: mainLangId,
        statusId: StatusId.Active,
      },
      abortController.signal
    );

    if (serviceResult.status && serviceResult.data) {
      const newCategories = [];
      const newTags = [];
      const newAttributes = [];
      const newVariations = [];

      for (const term of serviceResult.data) {
        if (term.typeId == PostTermTypeId.Category) {
          newCategories.push({
            value: term._id,
            label: term.contents?.title || t('[noLangAdd]'),
          });
        } else if (term.typeId == PostTermTypeId.Tag) {
          newTags.push({
            value: term._id,
            label: term.contents?.title || t('[noLangAdd]'),
          });
        } else if (term.typeId == PostTermTypeId.Attributes) {
          newAttributes.push({
            value: term._id,
            label: term.contents?.title || t('[noLangAdd]'),
          });
        } else if (term.typeId == PostTermTypeId.Variations) {
          newVariations.push({
            value: term._id,
            label: term.contents?.title || t('[noLangAdd]'),
            parentId: term.parentId?._id || '',
          });
        }
      }

      dispatch({
        type: PostAddActionTypes.SET_TERMS,
        payload: {
          categories: newCategories,
          tags: newTags,
          attributes: newAttributes,
          variations: newVariations,
        },
      });
    }
  };

  const getItem = async (_langId?: string) => {
    _langId = _langId || state.langId;
    const serviceResult = await PostService.getWithId(
      {
        _id: formState._id,
        typeId: formState.typeId,
        langId: _langId,
      },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const item = serviceResult.data;
      dispatch({
        type: PostAddActionTypes.SET_ITEM,
        payload: item,
      });

      let newFormState: IPostAddComponentFormState = {
        ...formState,
        ...(item as IPostUpdateWithIdParamService),
        contents: {
          ...formState.contents,
          ...item.contents,
          views: item.contents?.views ?? 0,
          langId: _langId,
          content: item.contents?.content || '',
        },
      };

      if (item.categories) {
        newFormState.categories = item.categories.map(
          (category) => category._id
        );
      }

      if (item.tags) {
        newFormState.tags = item.tags.map((tag) => tag._id);
      }

      if (item.components) {
        newFormState.components = item.components.map((component) => component);
      }

      if (item.authors) {
        newFormState.authors = item.authors.map((author) => author._id);
      }

      if (item.eCommerce) {
        newFormState.eCommerce = {
          ...item.eCommerce,
          attributes: item.eCommerce.attributes?.map((attribute) => ({
            ...attribute,
            attributeId: attribute.attributeId._id,
            variations: attribute.variations.map((variation) => variation._id),
          })),
          variations: item.eCommerce.variations?.map((variation) => ({
            ...variation,
            itemId: {
              ...variation.itemId,
              contents: {
                ...variation.itemId.contents,
                langId: _langId,
              },
            },
            selectedVariations: variation.selectedVariations.map(
              (selectedVariation) => ({
                ...selectedVariation,
                variationId: selectedVariation.variationId._id,
                attributeId: selectedVariation.attributeId._id,
              })
            ),
          })),
          variationDefaults: item.eCommerce.variationDefaults?.map(
            (variationDefault) => ({
              ...variationDefault,
              attributeId: variationDefault.attributeId._id,
              variationId: variationDefault.variationId._id,
            })
          ),
        };
      }

      setFormState(newFormState);

      dispatch({
        type: PostAddActionTypes.SET_IS_ICON_ACTIVE,
        payload: Boolean(
          item.contents && item.contents.icon && item.contents.icon.length > 0
        ),
      });

      if (_langId == mainLangId) {
        mainTitleRef.current = item.contents?.title ?? '';
      }
    } else {
      await navigatePage();
    }
  };

  const navigatePage = async () => {
    const postTypeId = formState.typeId;
    const pagePath = PostUtil.getPagePath(postTypeId);
    const path = pagePath.LIST;
    await RouteUtil.change({ router, path });
  };

  const onSubmit = async (event: FormEvent) => {
    const params = formState;
    let serviceResult;

    if (formState.typeId == PostTypeId.Product) {
      serviceResult = await (params._id
        ? PostService.updateProductWithId(params, abortController.signal)
        : PostService.addProduct(params, abortController.signal));
    } else {
      serviceResult = await (params._id
        ? PostService.updateWithId(params, abortController.signal)
        : PostService.add(params, abortController.signal));
    }

    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `${t(formState._id ? 'itemEdited' : 'itemAdded')}!`,
      });
      if (!formState._id) {
        await navigatePage();
      } else {
        if (
          (state.item?.alternates?.indexOfKey('langId', state.langId) ?? -1) < 0
        ) {
          const newItem: IPostAddComponentState['item'] = {
            ...state.item!,
            alternates: [
              ...(state.item?.alternates ?? []),
              {
                langId: state.langId,
              },
            ],
          };

          dispatch({
            type: PostAddActionTypes.SET_ITEM,
            payload: newItem,
          });
        }
      }
    }
  };

  const onChangeContent = (newContent: string) => {
    setFormState({
      contents: {
        ...formState.contents,
        content: newContent,
      },
    });
  };

  const TotalViews = () => {
    return (
      <ComponentToolTip message={t('views')}>
        <label className="badge badge-gradient-primary w-100 p-2 fs-6 rounded-3">
          <i className="mdi mdi-eye"></i> {formState.contents.views}
        </label>
      </ComponentToolTip>
    );
  };

  const Header = () => {
    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-6 align-content-center">
            <div className="row">
              <div className="col-md-3 mb-md-0 mb-4">
                <button
                  className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
                  onClick={() => navigatePage()}
                >
                  <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
                </button>
              </div>
              <div className="col-md-3 mb-md-0 mb-4">
                {formState._id &&
                [
                  PostTypeId.Page,
                  PostTypeId.Blog,
                  PostTypeId.Portfolio,
                  PostTypeId.Service,
                ].includes(Number(formState.typeId)) ? (
                  <TotalViews />
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <ComponentThemeContentLanguage
              onChange={(item) => onChangeLanguage(item.value._id)}
              selectedLangId={state.langId}
              showMissingMessage
              ownedLanguages={state.item?.alternates}
            />
          </div>
        </div>
      </div>
    );
  };

  const TabOptions = () => {
    const isUserSuperAdmin = PermissionUtil.checkPermissionRoleRank(
      sessionAuth!.user.roleId,
      UserRoleId.SuperAdmin
    );
    return (
      <div className="row">
        {!formState._id ||
        PermissionUtil.checkPermissionRoleRank(
          sessionAuth!.user.roleId,
          UserRoleId.Editor
        ) ||
        sessionAuth!.user.userId == state.item?.authorId?._id ? (
          <div className="col-md-7 mb-3">
            <ComponentFormSelect
              title={t('status')}
              name="statusId"
              options={state.status}
              value={state.status?.findSingle('value', formState.statusId)}
              onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
            />
          </div>
        ) : null}
        {formState.statusId == StatusId.Pending ? (
          <div className="col-md-7 mb-3">
            <ComponentFormInput
              title={`${t('startDate').toCapitalizeCase()}*`}
              type="date"
              name="dateStart"
              value={moment(formState.dateStart).format('YYYY-MM-DD')}
              onChange={(e) => onChangeInput(e)}
            />
          </div>
        ) : null}
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('rank')}
            name="rank"
            type="number"
            required={true}
            value={formState.rank}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        {[PostTypeId.Page].includes(Number(formState.typeId)) &&
        isUserSuperAdmin ? (
          <div className="col-md-7 mb-3">
            <ComponentFormSelect
              title={t('pageType')}
              name="pageTypeId"
              options={state.pageTypes}
              value={state.pageTypes?.findSingle(
                'value',
                formState.pageTypeId || ''
              )}
              onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
            />
          </div>
        ) : null}
        {!formState._id ||
        PermissionUtil.checkPermissionRoleRank(
          sessionAuth!.user.roleId,
          UserRoleId.Editor
        ) ||
        sessionAuth!.user.userId == state.item?.authorId?._id ? (
          <div className="col-md-7 mb-3">
            <ComponentFormSelect
              title={t('authors')}
              name="authors"
              isMulti
              closeMenuOnSelect={false}
              options={state.authors}
              value={state.authors?.filter((selectAuthor) =>
                formState.authors?.includes(selectAuthor.value)
              )}
              onChange={(item: any, e) => onChangeSelect(e.name, item)}
            />
          </div>
        ) : null}
        <div className="col-md-7 mb-3">
          <ComponentFormCheckBox
            title={t('isFixed')}
            name="isFixed"
            checked={Boolean(formState.isFixed)}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        {[PostTypeId.Page].includes(formState.typeId) && isUserSuperAdmin ? (
          <div className="col-md-7">
            <ComponentFormCheckBox
              title={t('noIndex')}
              name="isNoIndex"
              checked={Boolean(formState.isNoIndex)}
              onChange={(e) => onChangeInput(e)}
            />
          </div>
        ) : null}
      </div>
    );
  };

  const TabContent = () => {
    return (
      <div className="row">
        <div className="col-md-12 mb-3">
          <ComponentThemeRichTextBox
            value={formState.contents.content || ''}
            onChange={(newContent) => onChangeContent(newContent)}
          />
        </div>
      </div>
    );
  };

  const TabGeneral = () => {
    return (
      <div className="row">
        {[PostTypeId.Service].includes(Number(formState.typeId)) ? (
          <div className="col-md-7 mb-3">
            <div className="form-switch">
              <input
                checked={state.isIconActive}
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                onChange={(e) =>
                  dispatch({
                    type: PostAddActionTypes.SET_IS_ICON_ACTIVE,
                    payload: !state.isIconActive,
                  })
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
        {[PostTypeId.Service].includes(Number(formState.typeId)) &&
        state.isIconActive ? (
          <div className="col-md-7 mb-3">
            <ComponentFormInput
              title={`${t('icon')}`}
              name="contents.icon"
              type="text"
              value={formState.contents.icon}
              onChange={(e) => onChangeInput(e)}
            />
          </div>
        ) : null}
        {![PostTypeId.Service].includes(formState.typeId) ||
        !state.isIconActive ? (
          <div className="col-md-7 mb-3">
            <ComponentThemeChooseImage
              onSelected={(images) =>
                setFormState({
                  contents: {
                    ...formState.contents,
                    image: images[0],
                  },
                })
              }
              isMulti={false}
              selectedImages={
                formState.contents.image
                  ? [formState.contents.image]
                  : undefined
              }
              isShowReviewImage={true}
              reviewImage={formState.contents.image}
              reviewImageClassName={'post-image'}
            />
          </div>
        ) : null}
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('title')}*`}
            name="contents.title"
            type="text"
            required={true}
            value={formState.contents.title}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={t('shortContent').toCapitalizeCase()}
            name="contents.shortContent"
            type="textarea"
            value={formState.contents.shortContent}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        {![
          PostTypeId.Page,
          PostTypeId.Slider,
          PostTypeId.Service,
          PostTypeId.Testimonial,
        ].includes(Number(formState.typeId)) ? (
          <div className="col-md-7 mb-3">
            <ComponentPagePostAddChooseCategory
              dispatch={dispatch}
              state={state}
              formState={formState}
              setFormState={setFormState}
              onChangeSelect={onChangeSelect}
            />
          </div>
        ) : null}
        {![
          PostTypeId.Slider,
          PostTypeId.Service,
          PostTypeId.Testimonial,
        ].includes(Number(formState.typeId)) ? (
          <div className="col-md-7 mb-3">
            <ComponentPagePostAddChooseTag
              dispatch={dispatch}
              state={state}
              formState={formState}
              setFormState={setFormState}
              onChangeSelect={onChangeSelect}
            />
          </div>
        ) : null}
      </div>
    );
  };

  const isUserSuperAdmin = PermissionUtil.checkPermissionRoleRank(
    sessionAuth!.user.roleId,
    UserRoleId.SuperAdmin
  );

  return isPageLoading ? null : (
    <div className="page-post">
      <div className="row mb-3">
        <Header />
      </div>
      <div className="row position-relative">
        {state.isItemLoading ? (
          <ComponentSpinnerDonut customClass="page-spinner" />
        ) : null}
        <div className="col-md-12">
          <ComponentForm
            submitButtonText={t('save')}
            submitButtonSubmittingText={t('loading')}
            onSubmit={(event) => onSubmit(event)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="theme-tabs">
                    <Tabs
                      onSelect={(key: any) =>
                        dispatch({
                          type: PostAddActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
                          payload: key,
                        })
                      }
                      activeKey={state.mainTabActiveKey}
                      className="mb-5"
                      transition={false}
                    >
                      <Tab eventKey="general" title={t('general')}>
                        {TabGeneral()}
                      </Tab>
                      {![PostTypeId.Slider].includes(
                        Number(formState.typeId)
                      ) ? (
                        <Tab eventKey="content" title={t('content')}>
                          {state.mainTabActiveKey === 'content' ? (
                            <TabContent />
                          ) : (
                            ''
                          )}
                        </Tab>
                      ) : null}
                      {formState.typeId == PostTypeId.Page &&
                      !isUserSuperAdmin ? null : (
                        <Tab eventKey="options" title={t('options')}>
                          <TabOptions />
                        </Tab>
                      )}
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
            {[PostTypeId.BeforeAndAfter].includes(formState.typeId) ? (
              <ComponentPagePostAddBeforeAndAfter
                dispatch={dispatch}
                state={state}
                formState={formState}
                setFormState={setFormState}
              />
            ) : null}
            {[PostTypeId.Slider, PostTypeId.Service].includes(
              formState.typeId
            ) ? (
              <ComponentPagePostAddButton
                dispatch={dispatch}
                state={state}
                formState={formState}
                setFormState={setFormState}
              />
            ) : null}
            {isUserSuperAdmin &&
            [PostTypeId.Page].includes(formState.typeId) ? (
              <ComponentPagePostAddComponent
                dispatch={dispatch}
                state={state}
                formState={formState}
                setFormState={setFormState}
              />
            ) : null}
            {[PostTypeId.Product].includes(formState.typeId) ? (
              <ComponentPagePostAddECommerce
                dispatch={dispatch}
                state={state}
                formState={formState}
                setFormState={setFormState}
                onChangeSelect={onChangeSelect}
                onChangeInput={onChangeInput}
              />
            ) : null}
          </ComponentForm>
        </div>
      </div>
    </div>
  );
}
