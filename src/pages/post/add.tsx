import { FormEvent, useReducer, useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { PostTermService } from '@services/postTerm.service';
import { PostService } from '@services/post.service';
import {
  IPostGetResultService,
  IPostUpdateWithIdParamService,
} from 'types/services/post.service';
import { ProductTypeId, productTypes } from '@constants/productTypes';
import { IThemeFormSelectData } from '@components/elements/form/input/select';
import ComponentPagePostAddECommerce from '@components/pages/post/add/eCommerce';
import ComponentPagePostAddButtons from '@components/pages/post/add/buttons';
import ComponentPagePostAddBeforeAndAfter from '@components/pages/post/add/beforeAndAfter';
import { PermissionUtil, PostPermissionMethod } from '@utils/permission.util';
import { PostTypeId } from '@constants/postTypes';
import { PostUtil } from '@utils/post.util';
import { AttributeTypeId, attributeTypes } from '@constants/attributeTypes';
import { PageTypeId, pageTypes } from '@constants/pageTypes';
import { SelectUtil } from '@utils/select.util';
import { StatusId } from '@constants/status';
import { PostTermTypeId } from '@constants/postTermTypes';
import { ComponentService } from '@services/component.service';
import ComponentPagePostAddComponents from '@components/pages/post/add/components';
import { ComponentTypeId } from '@constants/componentTypes';
import { UserService } from '@services/user.service';
import { UserRoleId } from '@constants/userRoles';
import { RouteUtil } from '@utils/route.util';
import ComponentToast from '@components/elements/toast';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ComponentPagePostAddHeader from '@components/pages/post/add/header';
import ComponentPagePostAddTabGeneral from '@components/pages/post/add/tabGeneral';
import ComponentPagePostAddTabContent from '@components/pages/post/add/tabContent';
import ComponentPagePostAddTabOptions from '@components/pages/post/add/tabOptions';
import ComponentThemeModalPostTerm from '@components/theme/modal/postTerm';
import { IPagePostTermAddFormState } from './term/add';
import Swal from 'sweetalert2';

export type IPagePostAddState = {
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
  langId: string;
  isItemLoading: boolean;
  isIconActive: boolean;
  showTermModal: boolean;
  termTypeIdForModal: PostTermTypeId;
};

const initialState: IPagePostAddState = {
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
  langId: '',
  isItemLoading: false,
  isIconActive: false,
  showTermModal: false,
  termTypeIdForModal: PostTermTypeId.Category,
};

type IActionPayloadSetTerms = {
  categories: IPagePostAddState['categories'];
  tags: IPagePostAddState['tags'];
  attributes: IPagePostAddState['attributes'];
  variations: IPagePostAddState['variations'];
};

export enum ActionTypes {
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
  SET_LANG_ID,
  SET_TERMS,
  SET_IS_ITEM_LOADING,
  SET_IS_ICON_ACTIVE,
  SET_SHOW_TERM_MODAL,
  SET_TERM_TYPE_ID_FOR_MODAL,
}

export type IAction =
  | {
      type: ActionTypes.SET_AUTHORS;
      payload: IPagePostAddState['authors'];
    }
  | {
      type: ActionTypes.SET_PAGE_TYPES;
      payload: IPagePostAddState['pageTypes'];
    }
  | {
      type: ActionTypes.SET_ATTRIBUTE_TYPES;
      payload: IPagePostAddState['attributeTypes'];
    }
  | {
      type: ActionTypes.SET_PRODUCT_TYPES;
      payload: IPagePostAddState['productTypes'];
    }
  | {
      type: ActionTypes.SET_COMPONENTS;
      payload: IPagePostAddState['components'];
    }
  | {
      type: ActionTypes.SET_CATEGORIES;
      payload: IPagePostAddState['categories'];
    }
  | {
      type: ActionTypes.SET_TAGS;
      payload: IPagePostAddState['tags'];
    }
  | {
      type: ActionTypes.SET_ATTRIBUTES;
      payload: IPagePostAddState['attributes'];
    }
  | {
      type: ActionTypes.SET_VARIATIONS;
      payload: IPagePostAddState['variations'];
    }
  | {
      type: ActionTypes.SET_STATUS;
      payload: IPagePostAddState['status'];
    }
  | {
      type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IPagePostAddState['mainTabActiveKey'];
    }
  | {
      type: ActionTypes.SET_ITEM;
      payload: IPagePostAddState['item'];
    }
  | {
      type: ActionTypes.SET_LANG_ID;
      payload: IPagePostAddState['langId'];
    }
  | { type: ActionTypes.SET_TERMS; payload: IActionPayloadSetTerms }
  | {
      type: ActionTypes.SET_IS_ICON_ACTIVE;
      payload: IPagePostAddState['isIconActive'];
    }
  | {
      type: ActionTypes.SET_SHOW_TERM_MODAL;
      payload: IPagePostAddState['showTermModal'];
    }
  | {
      type: ActionTypes.SET_TERM_TYPE_ID_FOR_MODAL;
      payload: IPagePostAddState['termTypeIdForModal'];
    }
  | {
      type: ActionTypes.SET_IS_ITEM_LOADING;
      payload: IPagePostAddState['isItemLoading'];
    };

const reducer = (
  state: IPagePostAddState,
  action: IAction
): IPagePostAddState => {
  switch (action.type) {
    case ActionTypes.SET_AUTHORS:
      return { ...state, authors: action.payload };
    case ActionTypes.SET_PAGE_TYPES:
      return { ...state, pageTypes: action.payload };
    case ActionTypes.SET_ATTRIBUTE_TYPES:
      return { ...state, attributeTypes: action.payload };
    case ActionTypes.SET_PRODUCT_TYPES:
      return { ...state, productTypes: action.payload };
    case ActionTypes.SET_COMPONENTS:
      return { ...state, components: action.payload };
    case ActionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case ActionTypes.SET_TAGS:
      return { ...state, tags: action.payload };
    case ActionTypes.SET_ATTRIBUTES:
      return { ...state, attributes: action.payload };
    case ActionTypes.SET_VARIATIONS:
      return { ...state, variations: action.payload };
    case ActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    case ActionTypes.SET_LANG_ID:
      return { ...state, langId: action.payload };
    case ActionTypes.SET_TERMS:
      return {
        ...state,
        categories: action.payload.categories,
        tags: action.payload.tags,
        attributes: action.payload.attributes,
        variations: action.payload.variations,
      };
    case ActionTypes.SET_IS_ITEM_LOADING:
      return { ...state, isItemLoading: action.payload };
    case ActionTypes.SET_IS_ICON_ACTIVE:
      return { ...state, isIconActive: action.payload };
    case ActionTypes.SET_SHOW_TERM_MODAL:
      return { ...state, showTermModal: action.payload };
    case ActionTypes.SET_TERM_TYPE_ID_FOR_MODAL:
      return { ...state, termTypeIdForModal: action.payload };
    default:
      return state;
  }
};

export type IPageFormState = IPostUpdateWithIdParamService;

const initialFormState: IPageFormState = {
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
  postTypeId: PostTypeId;
};

export default function PagePostAdd() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const queries = {
    ...router.query,
    postTypeId: Number(router.query.postTypeId ?? PostTypeId.Blog),
  } as IPageQueries;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    langId: mainLangId,
  });

  const form = useForm<IPageFormState>({
    defaultValues: {
      ...initialFormState,
      typeId: queries.postTypeId,
      _id: queries._id ?? '',
    },
    resolver: zodResolver(PostUtil.getSchema(queries.postTypeId, queries._id)),
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
    const methodType = queries._id
      ? PostPermissionMethod.UPDATE
      : PostPermissionMethod.ADD;

    const minPermission = PermissionUtil.getPostPermission(
      queries.postTypeId,
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
        ].includes(queries.postTypeId)
      ) {
        await getTerms();
      }

      if ([PostTypeId.Page].includes(queries.postTypeId)) {
        await getComponents();
        getPageTypes();
      }
      if ([PostTypeId.Product].includes(queries.postTypeId)) {
        getAttributeTypes();
        getProductTypes();
      }
      if ([PostTypeId.BeforeAndAfter].includes(queries.postTypeId)) {
        form.setValue('beforeAndAfter', {
          imageBefore: '',
          imageAfter: '',
          images: [],
        });
      }
      await getAuthors();
      getStatus();
      if (queries._id) {
        await getItem();
      }
      setPageTitle();
      setIsPageLoaded(true);
    }
  };

  const onChangeLanguage = async (langId: string) => {
    dispatch({ type: ActionTypes.SET_IS_ITEM_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_LANG_ID, payload: langId });
    await getItem(langId);
    dispatch({ type: ActionTypes.SET_IS_ITEM_LOADING, payload: false });
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = PostUtil.getPageTitles({
      t: t,
      postTypeId: queries.postTypeId,
    });

    if (queries._id) {
      titles.push({ title: t('edit') });
      titles.push({ title: mainTitleRef.current });
    } else {
      titles.push({ title: t('add') });
    }

    appDispatch(setBreadCrumbState(titles));
  };

  const getAttributeTypes = () => {
    dispatch({
      type: ActionTypes.SET_ATTRIBUTE_TYPES,
      payload: attributeTypes.map((attribute) => ({
        label: t(attribute.langKey),
        value: attribute.id,
      })),
    });
  };

  const getProductTypes = () => {
    dispatch({
      type: ActionTypes.SET_PRODUCT_TYPES,
      payload: productTypes.map((product) => ({
        label: t(product.langKey),
        value: product.id,
      })),
    });
    form.setValue('eCommerce', {
      ...form.getValues().eCommerce,
      typeId: ProductTypeId.SimpleProduct,
      images: [],
    });
  };

  const getPageTypes = () => {
    dispatch({
      type: ActionTypes.SET_PAGE_TYPES,
      payload: pageTypes.map((pageType) => ({
        label: t(pageType.langKey),
        value: pageType.id,
      })),
    });
    form.setValue('pageTypeId', PageTypeId.Default);
  };

  const getStatus = () => {
    dispatch({
      type: ActionTypes.SET_STATUS,
      payload: SelectUtil.getStatus(
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
            queries.postTypeId,
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
        type: ActionTypes.SET_AUTHORS,
        payload: newItems.map((author) => {
          return {
            value: author._id,
            label: `${author.name} (${author.email})`,
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
        type: ActionTypes.SET_COMPONENTS,
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
        postTypeId: queries.postTypeId,
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
        type: ActionTypes.SET_TERMS,
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
    if (queries._id) {
      const serviceResult = await PostService.getWithId(
        {
          _id: queries._id,
          typeId: queries.postTypeId,
          langId: _langId,
        },
        abortController.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const item = serviceResult.data;
        dispatch({
          type: ActionTypes.SET_ITEM,
          payload: item,
        });

        const formValues = form.getValues();

        let newFormState: IPageFormState = {
          ...formValues,
          ...(item as IPostUpdateWithIdParamService),
          contents: {
            ...formValues.contents,
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
          newFormState.components = item.components.map(
            (component) => component
          );
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
              variations: attribute.variations.map(
                (variation) => variation._id
              ),
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

        form.reset(newFormState);

        dispatch({
          type: ActionTypes.SET_IS_ICON_ACTIVE,
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
    }
  };

  const navigatePage = async () => {
    const postTypeId = queries.postTypeId;
    const pagePath = PostUtil.getPagePath(postTypeId);
    const path = pagePath.LIST;
    await RouteUtil.change({ router, path });
  };

  const onSubmit = async (event: FormEvent) => {
    const params = form.getValues();
    let serviceResult = null;

    if (params.typeId == PostTypeId.Product) {
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
        content: `${t(params._id ? 'itemEdited' : 'itemAdded')}!`,
      });
      if (!params._id) {
        await navigatePage();
      } else {
        if (
          (state.item?.alternates?.indexOfKey('langId', state.langId) ?? -1) < 0
        ) {
          const newItem: IPagePostAddState['item'] = {
            ...state.item!,
            alternates: [
              ...(state.item?.alternates ?? []),
              {
                langId: state.langId,
              },
            ],
          };

          dispatch({
            type: ActionTypes.SET_ITEM,
            payload: newItem,
          });
        }
      }
    }
  };

  const onSubmitTermModal = (item: IPagePostTermAddFormState) => {
    switch (item.typeId) {
      case PostTermTypeId.Category:
        dispatch({
          type: ActionTypes.SET_CATEGORIES,
          payload: [
            ...state.categories,
            {
              label: item.contents?.title || t('[noLangAdd]'),
              value: item._id,
            },
          ],
        });
        break;
      case PostTermTypeId.Tag:
        dispatch({
          type: ActionTypes.SET_TAGS,
          payload: [
            ...state.tags,
            {
              label: item.contents?.title || t('[noLangAdd]'),
              value: item._id,
            },
          ],
        });
        break;
    }
  };

  const onClickShowTermModal = (termTypeId: PostTermTypeId) => {
    dispatch({
      type: ActionTypes.SET_TERM_TYPE_ID_FOR_MODAL,
      payload: termTypeId,
    });
    dispatch({ type: ActionTypes.SET_SHOW_TERM_MODAL, payload: true });
  };

  const onClickAddNewButton = () => {
    form.setValue('contents.buttons', [
      ...(form.getValues().contents?.buttons || []),
      {
        _id: String.createId(),
        title: '',
        url: '',
      },
    ]);
  };

  const onClickDeleteButton = (_id: string) => {
    const formValues = form.getValues();
    if (formValues.contents.buttons) {
      form.setValue(
        'contents.buttons',
        formValues.contents.buttons.filter((item) => item._id != _id)
      );
    }
  };

  const onClickAddNewComponent = () => {
    form.setValue('components', [...(form.getValues().components || []), '']);
  };

  const onClickDeleteComponent = (_id: string) => {
    const formValues = form.getValues();
    if (formValues.components) {
      form.setValue(
        'components',
        formValues.components.filter((item) => item != _id)
      );
    }
  };

  const checkSameVariation = (attributeId: string, variationId: string) => {
    const variations = form.getValues().eCommerce?.variations ?? [];
    const filteredVariations = variations.findMulti(
      'selectedVariations.attributeId',
      attributeId
    );
    return filteredVariations.some((filteredVariation) =>
      filteredVariation.selectedVariations.some(
        (selectedVariation) => selectedVariation.variationId == variationId
      )
    );
  };

  const onClickAddNewAttribute = () => {
    const _id = String.createId();

    let newAttributes = form.getValues().eCommerce?.attributes ?? [];
    newAttributes.push({
      _id: _id,
      attributeId: '',
      typeId: AttributeTypeId.Text,
      variations: [],
    });

    form.setValue('eCommerce.attributes', newAttributes);
  };

  const onClickDeleteAttribute = (_id: string) => {
    form.setValue(
      'eCommerce.attributes',
      form.getValues().eCommerce?.attributes?.filter((item) => item._id != _id)
    );
  };

  const onChangeAttribute = (mainId: string, attributeId: string) => {
    let newAttributes = form.getValues().eCommerce?.attributes ?? [];
    const index = newAttributes?.indexOfKey('_id', mainId);
    if (index > -1) {
      newAttributes[index].attributeId = attributeId;
      newAttributes[index].variations = [];
    }
    form.setValue('eCommerce.attributes', newAttributes);
  };

  const onClickAddNewVariation = () => {
    const _id = String.createId();

    const formValues = form.getValues();

    let newVariations = formValues.eCommerce?.variations ?? [];
    newVariations.push({
      _id: _id,
      selectedVariations: [],
      rank: formValues.eCommerce?.variations?.length ?? 0,
      itemId: {
        _id: String.createId(),
        statusId: StatusId.Active,
        contents: {
          title: '',
          langId: formValues.contents.langId,
        },
        eCommerce: {
          images: [],
          pricing: {
            taxIncluded: 0,
            compared: 0,
            shipping: 0,
            taxExcluded: 0,
            taxRate: 0,
          },
          shipping: {
            width: '',
            height: '',
            depth: '',
            weight: '',
          },
          inventory: {
            sku: '',
            quantity: 0,
            isManageStock: false,
          },
        },
      },
    });

    form.setValue('eCommerce.variations', newVariations);
  };

  const onClickDeleteVariation = async (_id: string) => {
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: `${t('deleteSelectedItemsQuestion')}`,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      form.setValue(
        'eCommerce.variations',
        form
          .getValues()
          .eCommerce?.variations?.filter((item) => item._id != _id)
      );
    }
  };

  const onChangeVariation = (
    mainId: string,
    attributeId: string,
    variationId: string
  ) => {
    if (!checkSameVariation(attributeId, variationId)) {
      const newVariations = form.getValues().eCommerce?.variations ?? [];
      const variation = newVariations.findSingle('_id', mainId);
      if (variation) {
        const index = variation.selectedVariations.indexOfKey(
          'attributeId',
          attributeId
        );
        if (index > -1) {
          variation.selectedVariations[index].variationId = variationId;
        } else {
          variation.selectedVariations.push({
            attributeId: attributeId,
            variationId: variationId,
          });
        }
      }

      form.setValue('eCommerce.variations', newVariations);
    }
  };

  const onChangeDefaultVariation = (
    attributeId: string,
    variationId: string
  ) => {
    const formValues = form.getValues();
    let newDefaultVariation = formValues.eCommerce?.variationDefaults ?? [];

    const index = newDefaultVariation.indexOfKey('attributeId', attributeId);

    if (index > -1) {
      newDefaultVariation[index].variationId = variationId;
    } else {
      newDefaultVariation.push({
        attributeId: attributeId,
        variationId: variationId,
      });
    }
  };

  const formValues = form.getValues();
  const isUserSuperAdmin = PermissionUtil.checkPermissionRoleRank(
    sessionAuth!.user.roleId,
    UserRoleId.SuperAdmin
  );

  console.log('page post add', state, formValues);

  return isPageLoading ? null : (
    <div className="page-post">
      <ComponentThemeModalPostTerm
        isShow={state.showTermModal}
        postTypeId={formValues.typeId}
        termTypeId={state.termTypeIdForModal}
        items={
          state.termTypeIdForModal == PostTermTypeId.Category
            ? state.categories
            : state.tags
        }
        onSubmit={(item) => onSubmitTermModal(item)}
        onHide={() =>
          dispatch({ type: ActionTypes.SET_SHOW_TERM_MODAL, payload: false })
        }
      />
      <div className="row mb-3">
        <ComponentPagePostAddHeader
          item={state.item}
          langId={state.langId}
          showTotalView={Boolean(
            formValues._id &&
              [
                PostTypeId.Page,
                PostTypeId.Blog,
                PostTypeId.Portfolio,
                PostTypeId.Service,
              ].includes(formValues.typeId)
          )}
          views={formValues.contents.views}
          onNavigatePage={() => navigatePage()}
          onChangeLanguage={(_id) => onChangeLanguage(_id)}
        />
      </div>
      <div className="row position-relative">
        {state.isItemLoading ? (
          <ComponentSpinnerDonut customClass="page-spinner" />
        ) : null}
        <div className="col-md-12">
          <ComponentForm
            formMethods={form}
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
                          type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
                          payload: key,
                        })
                      }
                      activeKey={state.mainTabActiveKey}
                      className="mb-5"
                      transition={false}
                    >
                      <Tab eventKey="general" title={t('general')}>
                        <ComponentPagePostAddTabGeneral
                          categories={state.categories}
                          tags={state.tags}
                          icon={formValues.contents.icon}
                          image={formValues.contents.image}
                          isIconActive={state.isIconActive}
                          selectedCategories={formValues.categories}
                          selectedTags={formValues.tags}
                          showCategorySelect={
                            ![
                              PostTypeId.Page,
                              PostTypeId.Slider,
                              PostTypeId.Service,
                              PostTypeId.Testimonial,
                            ].includes(formValues.typeId)
                          }
                          showIconCheckBox={[PostTypeId.Service].includes(
                            formValues.typeId
                          )}
                          showTagSelect={
                            ![
                              PostTypeId.Slider,
                              PostTypeId.Service,
                              PostTypeId.Testimonial,
                            ].includes(formValues.typeId)
                          }
                          onChangeImage={(image) =>
                            form.setValue('contents.image', image)
                          }
                          onChangeIsIconActive={() =>
                            dispatch({
                              type: ActionTypes.SET_IS_ICON_ACTIVE,
                              payload: !state.isIconActive,
                            })
                          }
                          onClickShowTermModal={(termTypeId) =>
                            onClickShowTermModal(termTypeId)
                          }
                        />
                      </Tab>
                      {![PostTypeId.Slider].includes(
                        Number(formValues.typeId)
                      ) ? (
                        <Tab eventKey="content" title={t('content')}>
                          {state.mainTabActiveKey === 'content' ? (
                            <ComponentPagePostAddTabContent />
                          ) : (
                            ''
                          )}
                        </Tab>
                      ) : null}
                      {formValues.typeId == PostTypeId.Page &&
                      !isUserSuperAdmin ? null : (
                        <Tab eventKey="options" title={t('options')}>
                          <ComponentPagePostAddTabOptions
                            status={state.status}
                            statusId={formValues.statusId}
                            authors={state.authors}
                            pageTypeId={formValues.pageTypeId}
                            pageTypes={state.pageTypes}
                            selectedAuthors={formValues.authors}
                            showAuthorsSelect={
                              !formValues._id ||
                              PermissionUtil.checkPermissionRoleRank(
                                sessionAuth!.user.roleId,
                                UserRoleId.Editor
                              ) ||
                              sessionAuth!.user.userId ==
                                state.item?.authorId?._id
                            }
                            showNoIndexCheckBox={
                              [PostTypeId.Page].includes(formValues.typeId) &&
                              isUserSuperAdmin
                            }
                            showPageTypeSelect={
                              [PostTypeId.Page].includes(formValues.typeId) &&
                              isUserSuperAdmin
                            }
                            showStatusSelect={
                              !formValues._id ||
                              PermissionUtil.checkPermissionRoleRank(
                                sessionAuth!.user.roleId,
                                UserRoleId.Editor
                              ) ||
                              sessionAuth!.user.userId ==
                                state.item?.authorId?._id
                            }
                          />
                        </Tab>
                      )}
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
            {[PostTypeId.BeforeAndAfter].includes(formValues.typeId) ? (
              <ComponentPagePostAddBeforeAndAfter
                imageAfter={formValues.beforeAndAfter?.imageAfter}
                imageBefore={formValues.beforeAndAfter?.imageBefore}
                images={formValues.beforeAndAfter?.images}
                onChangeImageAfter={(image) =>
                  form.setValue('beforeAndAfter.imageAfter', image)
                }
                onChangeImageBefore={(image) =>
                  form.setValue('beforeAndAfter.imageBefore', image)
                }
                onChangeImages={(images) =>
                  form.setValue('beforeAndAfter.images', images)
                }
              />
            ) : null}
            {[PostTypeId.Slider, PostTypeId.Service].includes(
              formValues.typeId
            ) ? (
              <ComponentPagePostAddButtons
                items={formValues.contents.buttons}
                onClickAddNew={() => onClickAddNewButton()}
                onClickDelete={(_id) => onClickDeleteButton(_id)}
              />
            ) : null}
            {isUserSuperAdmin &&
            [PostTypeId.Page].includes(formValues.typeId) ? (
              <ComponentPagePostAddComponents
                components={state.components}
                selectedComponents={formValues.components}
                onClickAddNew={() => onClickAddNewComponent()}
                onClickDelete={(_id) => onClickDeleteComponent(_id)}
              />
            ) : null}
            {[PostTypeId.Product].includes(formValues.typeId) ? (
              <ComponentPagePostAddECommerce
                variations={state.variations}
                attributes={state.attributes}
                attributeTypes={state.attributeTypes}
                productTypes={state.productTypes}
                eCommerce={formValues.eCommerce}
                onClickAddNewAttribute={() => onClickAddNewAttribute()}
                onClickDeleteAttribute={(_id) => onClickDeleteAttribute(_id)}
                onClickAddNewVariation={() => onClickAddNewVariation()}
                onClickDeleteVariation={(_id) => onClickDeleteVariation(_id)}
                onChangeAttribute={(mainId, attributeId) =>
                  onChangeAttribute(mainId, attributeId)
                }
                onChangeVariation={(mainId, attributeId, variationId) =>
                  onChangeVariation(mainId, attributeId, variationId)
                }
                onChangeDefaultVariation={(attributeId, variationId) =>
                  onChangeDefaultVariation(attributeId, variationId)
                }
              />
            ) : null}
          </ComponentForm>
        </div>
      </div>
    </div>
  );
}
