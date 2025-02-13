import React, { FormEvent, useReducer, useRef, useState } from 'react';
import { PostTermService } from '@services/postTerm.service';
import { PostService } from '@services/post.service';
import {
  IPostGetResultService,
  IPostGetResultServiceECommerceVariation,
  IPostUpdateWithIdParamService,
} from 'types/services/post.service';
import { ProductTypeId, productTypes } from '@constants/productTypes';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
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
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentThemeForm from '@components/theme/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
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
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';
import ComponentThemeTabs from '@components/theme/tabs';
import ComponentThemeTab from '@components/theme/tabs/tab';

export type IPagePostAddState = {
  authors: IComponentInputSelectData<string>[];
  pageTypes: IComponentInputSelectData<PageTypeId>[];
  attributeTypes: IComponentInputSelectData<AttributeTypeId>[];
  productTypes: IComponentInputSelectData<ProductTypeId>[];
  components: IComponentInputSelectData<string>[];
  categoryTerms: IComponentInputSelectData<string>[];
  tagTerms: IComponentInputSelectData<string>[];
  attributeTerms: IComponentInputSelectData<string>[];
  variationTerms: (IComponentInputSelectData<string> & { parentId: string })[];
  status: IComponentInputSelectData<StatusId>[];
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
  categoryTerms: [],
  tagTerms: [],
  attributeTerms: [],
  variationTerms: [],
  status: [],
  mainTabActiveKey: 'general',
  langId: '',
  isItemLoading: false,
  isIconActive: false,
  showTermModal: false,
  termTypeIdForModal: PostTermTypeId.Category,
};

type IActionPayloadSetTerms = {
  categories: IPagePostAddState['categoryTerms'];
  tags: IPagePostAddState['tagTerms'];
  attributes: IPagePostAddState['attributeTerms'];
  variations: IPagePostAddState['variationTerms'];
};

export enum ActionTypes {
  SET_AUTHORS,
  SET_PAGE_TYPES,
  SET_ATTRIBUTE_TYPES,
  SET_PRODUCT_TYPES,
  SET_COMPONENTS,
  SET_CATEGORY_TERMS,
  SET_TAG_TERMS,
  SET_ATTRIBUTE_TERMS,
  SET_VARIATION_TERMS,
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
  | IActionWithPayload<ActionTypes.SET_AUTHORS, IPagePostAddState['authors']>
  | IActionWithPayload<
      ActionTypes.SET_PAGE_TYPES,
      IPagePostAddState['pageTypes']
    >
  | IActionWithPayload<
      ActionTypes.SET_ATTRIBUTE_TYPES,
      IPagePostAddState['attributeTypes']
    >
  | IActionWithPayload<
      ActionTypes.SET_PRODUCT_TYPES,
      IPagePostAddState['productTypes']
    >
  | IActionWithPayload<
      ActionTypes.SET_COMPONENTS,
      IPagePostAddState['components']
    >
  | IActionWithPayload<
      ActionTypes.SET_CATEGORY_TERMS,
      IPagePostAddState['categoryTerms']
    >
  | IActionWithPayload<ActionTypes.SET_TAG_TERMS, IPagePostAddState['tagTerms']>
  | IActionWithPayload<
      ActionTypes.SET_ATTRIBUTE_TERMS,
      IPagePostAddState['attributeTerms']
    >
  | IActionWithPayload<
      ActionTypes.SET_VARIATION_TERMS,
      IPagePostAddState['variationTerms']
    >
  | IActionWithPayload<ActionTypes.SET_STATUS, IPagePostAddState['status']>
  | IActionWithPayload<
      ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
      IPagePostAddState['mainTabActiveKey']
    >
  | IActionWithPayload<ActionTypes.SET_ITEM, IPagePostAddState['item']>
  | IActionWithPayload<ActionTypes.SET_LANG_ID, IPagePostAddState['langId']>
  | IActionWithPayload<ActionTypes.SET_TERMS, IActionPayloadSetTerms>
  | IActionWithPayload<
      ActionTypes.SET_IS_ICON_ACTIVE,
      IPagePostAddState['isIconActive']
    >
  | IActionWithPayload<
      ActionTypes.SET_SHOW_TERM_MODAL,
      IPagePostAddState['showTermModal']
    >
  | IActionWithPayload<
      ActionTypes.SET_TERM_TYPE_ID_FOR_MODAL,
      IPagePostAddState['termTypeIdForModal']
    >
  | IActionWithPayload<
      ActionTypes.SET_IS_ITEM_LOADING,
      IPagePostAddState['isItemLoading']
    >;

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
    case ActionTypes.SET_CATEGORY_TERMS:
      return { ...state, categoryTerms: action.payload };
    case ActionTypes.SET_TAG_TERMS:
      return { ...state, tagTerms: action.payload };
    case ActionTypes.SET_ATTRIBUTE_TERMS:
      return { ...state, attributeTerms: action.payload };
    case ActionTypes.SET_VARIATION_TERMS:
      return { ...state, variationTerms: action.payload };
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
        categoryTerms: action.payload.categories,
        tagTerms: action.payload.tags,
        attributeTerms: action.payload.attributes,
        variationTerms: action.payload.variations,
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
  const abortControllerRef = React.useRef(new AbortController());

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
      contents: {
        ...initialFormState.contents,
        langId: mainLangId,
      },
    },
    resolver: zodResolver(PostUtil.getSchema(queries.postTypeId, queries._id)),
  });

  const { showToast } = useToast();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const mainTitleRef = useRef<string>('');

  useDidMount(() => {
    init();
    return () => {
      abortControllerRef.current.abort();
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
      await PermissionUtil.checkAndRedirect({
        minPermission,
        router,
        sessionAuth,
        t,
        showToast,
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
        setECommerceDefaultValues();
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
      abortControllerRef.current.signal
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
      abortControllerRef.current.signal
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
      abortControllerRef.current.signal
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
            parentId: term.parentId || '',
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
        abortControllerRef.current.signal
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
              attributeTermId: attribute.attributeTermId,
              variationTerms: attribute.variationTerms.map(
                (variation) => variation._id
              ),
            })),
            variations: item.eCommerce.variations?.map((variation) => ({
              ...variation,
              product: {
                statusId: StatusId.Active,
                rank: 0,
                ...variation.product,
                contents: {
                  ...variation.product?.contents,
                  langId: _langId,
                  title: '',
                },
              },
              options: variation.options.map((option) => ({
                ...option,
                variationTermId: option.variationTermId,
                attributeId: option.attributeId,
              })),
            })),
            defaultVariationOptions:
              item.eCommerce.defaultVariationOptions?.map(
                (defaultVariationOption) => ({
                  ...defaultVariationOption,
                  attributeId: defaultVariationOption.attributeId,
                  variationId: defaultVariationOption.variationTermId,
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

  const setECommerceDefaultValues = () => {
    form.setValue('eCommerce', {
      ...form.getValues().eCommerce,
      typeId: ProductTypeId.SimpleProduct,
      images: [],
      attributes: [],
      variations: [],
      defaultVariationOptions: [],
    });
  };

  const navigatePage = async () => {
    const postTypeId = queries.postTypeId;
    const pagePath = PostUtil.getPagePath(postTypeId);
    const path = pagePath.LIST;
    await RouteUtil.change({ router, path });
  };

  const onSubmit = async (data: IPageFormState) => {
    const params = data;
    
    let serviceResult = null;

    if (params.typeId == PostTypeId.Product) {
      serviceResult = await (params._id
        ? PostService.updateProductWithId(
            params,
            abortControllerRef.current.signal
          )
        : PostService.addProduct(params, abortControllerRef.current.signal));
    } else {
      serviceResult = await (params._id
        ? PostService.updateWithId(params, abortControllerRef.current.signal)
        : PostService.add(params, abortControllerRef.current.signal));
    }

    if (serviceResult.status) {
      showToast({
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
          type: ActionTypes.SET_CATEGORY_TERMS,
          payload: [
            ...state.categoryTerms,
            {
              label: item.contents?.title || t('[noLangAdd]'),
              value: item._id,
            },
          ],
        });
        break;
      case PostTermTypeId.Tag:
        dispatch({
          type: ActionTypes.SET_TAG_TERMS,
          payload: [
            ...state.tagTerms,
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
    const formValues = form.getValues();
    form.setValue(
      'contents.buttons',
      [
        ...(formValues.contents.buttons ?? []),
        {
          _id: String.createId(),
          title: '',
          url: '',
        },
      ]
    );
    form.trigger(['contents.buttons']);
  };

  const onClickDeleteButton = (_id: string) => {
    const formValues = form.getValues();
    if (formValues.contents.buttons) {
      form.setValue(
        'contents.buttons',
        formValues.contents.buttons.filter((button) => button._id != _id)
      );
      form.trigger(['contents.buttons']);
    }
  };

  const onClickAddNewComponent = () => {
    form.setValue('components', [...(form.getValues().components || []), '']);
    form.trigger(['components']);
  };

  const onClickDeleteComponent = (_id: string) => {
    const formValues = form.getValues();
    if (formValues.components) {
      form.setValue(
        'components',
        formValues.components.filter((item) => item != _id)
      );
      form.trigger(['components']);
    }
  };

  const checkSameVariation = (
    variationId: string,
    attributeId: string,
    variationTermId: string
  ) => {
    const variations = form.getValues().eCommerce?.variations ?? [];

    const selectedVariation = variations.findSingle('_id', variationId);

    if (!selectedVariation) {
      return false;
    }

    return variations.some(
      (variation) =>
        variation._id != variationId &&
        variation?.options.every((option) => {
          if (option.attributeId == attributeId) {
            return option.variationTermId == variationTermId;
          } else {
            const selectedVariationOption = (
              selectedVariation! as IPostGetResultServiceECommerceVariation
            ).options.findSingle('attributeId', option.attributeId);
            return (
              option.variationTermId == selectedVariationOption?.variationTermId
            );
          }
        })
    );
  };

  const onClickAddNewAttribute = () => {
    const formValues = form.getValues();
    if (state.attributeTerms.length > 0 && formValues.eCommerce) {
      const _id = String.createId();

      form.setValue(
        `eCommerce.attributes.${(formValues.eCommerce.attributes ?? []).length}`,
        {
          _id: _id,
          attributeTermId: state.attributeTerms[0].value,
          typeId: AttributeTypeId.Text,
          variationTerms: [],
        }
      );

      form.setValue(
        `eCommerce.defaultVariationOptions.${(formValues.eCommerce.defaultVariationOptions ?? []).length}`,
        {
          _id: String.createId(),
          attributeId: _id,
          variationTermId: '',
        }
      );

      form.setValue(
        'eCommerce.variations',
        formValues.eCommerce.variations?.map((variation) => ({
          ...variation,
          options: [
            ...variation.options,
            {
              _id: String.createId(),
              attributeId: _id,
              variationTermId: '',
            },
          ],
        }))
      );

      form.trigger([
        `eCommerce.attributes.${(formValues.eCommerce.attributes ?? []).length}`,
      ]);
    } else {
      showToast({
        type: 'error',
        title: t('error'),
        content: t('eCommerceAttributeLengthError'),
      });
    }
  };

  const onClickAddNewVariation = () => {
    const formValues = form.getValues();

    if (formValues.eCommerce) {
      const _id = String.createId();
      const productId = String.createId();

      form.setValue(
        `eCommerce.variations.${(formValues.eCommerce.variations ?? []).length}`,
        {
          _id: _id,
          options: formValues.eCommerce.attributes.map((attribute) => ({
            _id: String.createId(),
            attributeId: attribute._id,
            variationTermId: '',
          })),
          productId: productId,
          product: {
            _id: productId,
            statusId: StatusId.Active,
            rank: formValues.eCommerce.variations.length ?? 0,
            contents: {
              title: '',
              langId: formValues.contents.langId,
            },
            eCommerce: {
              images: [],
              typeId: ProductTypeId.SimpleProduct,
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
        }
      );

      form.trigger([
        `eCommerce.variations.${(formValues.eCommerce.variations ?? []).length}`,
      ]);
    }
  };

  const onChangeAttribute = (attributeId: string, attributeTermId: string) => {
    const formValues = form.getValues();
    if (formValues.eCommerce) {
      const attributes = formValues.eCommerce.attributes;
      if (attributes) {
        const indexAttribute = attributes?.indexOfKey('_id', attributeId);
        if (typeof indexAttribute === 'number' && indexAttribute > -1) {
          const attribute = attributes[indexAttribute];
          if (attribute.attributeTermId != attributeTermId) {
            form.setValue(`eCommerce.attributes.${indexAttribute}`, {
              ...attribute,
              attributeTermId,
              variationTerms: [],
            });

            form.setValue(
              'eCommerce.defaultVariationOptions',
              formValues.eCommerce.defaultVariationOptions?.map((option) =>
                option.attributeId == attributeId
                  ? {
                      ...option,
                      variationTermId: '',
                    }
                  : option
              )
            );

            form.setValue(
              'eCommerce.variations',
              formValues.eCommerce.variations?.map((variation) => ({
                ...variation,
                options: variation.options.map((option) =>
                  option.attributeId == attributeId
                    ? {
                        ...option,
                        variationTermId: '',
                      }
                    : option
                ),
              }))
            );

            form.trigger([`eCommerce.attributes.${indexAttribute}`]);
          }
        }
      }
    }
  };

  const onChangeAttributeVariationTerms = (
    attributeId: string,
    variationTerms: string[]
  ) => {
    const formValues = form.getValues();
    if (formValues.eCommerce) {
      const attributes = formValues.eCommerce.attributes;
      if (attributes) {
        const indexAttribute = attributes?.indexOfKey('_id', attributeId);
        if (typeof indexAttribute === 'number' && indexAttribute > -1) {
          const attribute = attributes[indexAttribute];

          form.setValue(`eCommerce.attributes.${indexAttribute}`, {
            ...attribute,
            variationTerms: variationTerms,
          });

          form.setValue(
            'eCommerce.defaultVariationOptions',
            formValues.eCommerce.defaultVariationOptions?.map((option) =>
              option.attributeId == attributeId &&
              !variationTerms.includes(option.variationTermId)
                ? {
                    ...option,
                    variationTermId: '',
                  }
                : option
            )
          );

          form.setValue(
            'eCommerce.variations',
            formValues.eCommerce.variations?.map((variation) => ({
              ...variation,
              options: variation.options.map((option) =>
                option.attributeId == attributeId &&
                !variationTerms.includes(option.variationTermId)
                  ? {
                      ...option,
                      variationTermId: '',
                    }
                  : option
              ),
            }))
          );

          form.trigger([`eCommerce.attributes.${indexAttribute}`]);
        }
      }
    }
  };

  const onChangeVariationOption = (
    variationId: string,
    attributeId: string,
    variationTermId: string
  ) => {
    const formValues = form.getValues();
    if (formValues.eCommerce) {
      if (!checkSameVariation(variationId, attributeId, variationTermId)) {
        const variations = formValues.eCommerce.variations;
        if (variations) {
          const indexVariation = variations.indexOfKey('_id', variationId);
          if (typeof indexVariation === 'number' && indexVariation > -1) {
            const variation = variations[indexVariation];
            const indexOption = variation.options.indexOfKey(
              'attributeId',
              attributeId
            );
            if (indexOption > -1) {
              const option = variation.options[indexOption];
              if (option.variationTermId != variationTermId) {
                form.setValue(
                  `eCommerce.variations.${indexVariation}.options.${indexOption}`,
                  {
                    ...option,
                    variationTermId,
                  }
                );
                form.trigger([`eCommerce.variations.${indexVariation}`]);
              }
            }
          }
        }
      } else {
        showToast({
          type: 'error',
          title: t('error'),
          content: t('sameVariationErrorMessage'),
        });
      }
    }
  };

  const onClickDeleteAttribute = (_id: string) => {
    const formValues = form.getValues();

    if (formValues.eCommerce) {
      const newAttributes = formValues.eCommerce.attributes.filter(
        (attribute) => attribute._id != _id
      );
      const newDefaultVariationOptions =
        formValues.eCommerce.defaultVariationOptions?.filter(
          (option) => option.attributeId != _id
        );
      const newVariations = formValues.eCommerce.variations?.map(
        (variation) => ({
          ...variation,
          options: variation.options.filter(
            (option) => option.attributeId != _id
          ),
        })
      );

      form.setValue('eCommerce.attributes', newAttributes);
      form.setValue(
        'eCommerce.defaultVariationOptions',
        newDefaultVariationOptions
      );
      form.setValue('eCommerce.variations', newVariations);
      form.trigger(['eCommerce.attributes']);
    }
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
      const formValues = form.getValues();
      if (formValues.eCommerce) {
        const newVariations =
          formValues.eCommerce?.variations.filter(
            (variation) => variation._id != _id
          ) ?? [];
        form.setValue('eCommerce.variations', newVariations);
        form.trigger(['eCommerce.variations']);
      }
    }
  };

  const formValues = form.getValues();
  const isUserSuperAdmin = PermissionUtil.checkPermissionRoleRank(
    sessionAuth!.user.roleId,
    UserRoleId.SuperAdmin
  );

  return isPageLoading ? null : (
    <div className="page-post">
      <ComponentThemeModalPostTerm
        isShow={state.showTermModal}
        postTypeId={formValues.typeId}
        termTypeId={state.termTypeIdForModal}
        items={
          state.termTypeIdForModal == PostTermTypeId.Category
            ? state.categoryTerms
            : state.tagTerms
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
          showLanguageSelector={formValues._id ? true : false}
          onNavigatePage={() => navigatePage()}
          onChangeLanguage={(_id) => onChangeLanguage(_id)}
        />
      </div>
      <div className="row position-relative">
        {state.isItemLoading ? (
          <ComponentSpinnerDonut customClass="page-spinner" />
        ) : null}
        <div className="col-md-12">
          <ComponentThemeForm
            formMethods={form}
            onSubmit={(data) => onSubmit(data)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <ComponentThemeTabs
                    onSelect={(key: any) =>
                      dispatch({
                        type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
                        payload: key,
                      })
                    }
                    activeKey={state.mainTabActiveKey}
                  >
                    <ComponentThemeTab eventKey="general" title={t('general')}>
                      <ComponentPagePostAddTabGeneral
                        categoryTerms={state.categoryTerms}
                        tagTerms={state.tagTerms}
                        isIconActive={state.isIconActive}
                        showCategoryTermSelect={
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
                        showTagTermSelect={
                          ![
                            PostTypeId.Slider,
                            PostTypeId.Service,
                            PostTypeId.Testimonial,
                          ].includes(formValues.typeId)
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
                    </ComponentThemeTab>
                    {![PostTypeId.Slider].includes(
                      Number(formValues.typeId)
                    ) ? (
                      <ComponentThemeTab
                        eventKey="content"
                        title={t('content')}
                      >
                        {state.mainTabActiveKey === 'content' ? (
                          <ComponentPagePostAddTabContent />
                        ) : (
                          ''
                        )}
                      </ComponentThemeTab>
                    ) : null}
                    {formValues.typeId == PostTypeId.Page &&
                    !isUserSuperAdmin ? null : (
                      <ComponentThemeTab
                        eventKey="options"
                        title={t('options')}
                      >
                        <ComponentPagePostAddTabOptions
                          status={state.status}
                          statusId={formValues.statusId}
                          authors={state.authors}
                          pageTypes={state.pageTypes}
                          showAuthorsSelect={
                            !formValues._id ||
                            PermissionUtil.checkPermissionRoleRank(
                              sessionAuth!.user.roleId,
                              UserRoleId.Editor
                            ) ||
                            sessionAuth!.user.userId == state.item?.authorId
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
                            sessionAuth!.user.userId == state.item?.authorId
                          }
                        />
                      </ComponentThemeTab>
                    )}
                  </ComponentThemeTabs>
                </div>
              </div>
            </div>
            {[PostTypeId.BeforeAndAfter].includes(formValues.typeId) ? (
              <ComponentPagePostAddBeforeAndAfter
                images={formValues.beforeAndAfter?.images}
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
                onClickAddNew={() => onClickAddNewComponent()}
                onClickDelete={(_id) => onClickDeleteComponent(_id)}
              />
            ) : null}
            {[PostTypeId.Product].includes(formValues.typeId) ? (
              <ComponentPagePostAddECommerce
                variationTerms={state.variationTerms}
                attributeTerms={state.attributeTerms}
                attributeTypes={state.attributeTypes}
                productTypes={state.productTypes}
                eCommerce={formValues.eCommerce}
                onClickAddNewAttribute={() => onClickAddNewAttribute()}
                onClickDeleteAttribute={(_id) => onClickDeleteAttribute(_id)}
                onChangeAttribute={(attributeId, attributeTermId) =>
                  onChangeAttribute(attributeId, attributeTermId)
                }
                onChangeAttributeVariationTerms={(
                  attributeId,
                  variationTerms
                ) =>
                  onChangeAttributeVariationTerms(attributeId, variationTerms)
                }
                onClickAddNewVariation={() => onClickAddNewVariation()}
                onClickDeleteVariation={(_id) => onClickDeleteVariation(_id)}
                onChangeVariationOption={(
                  variationId,
                  attributeId,
                  variationTermId
                ) =>
                  onChangeVariationOption(
                    variationId,
                    attributeId,
                    variationTermId
                  )
                }
              />
            ) : null}
          </ComponentThemeForm>
        </div>
      </div>
    </div>
  );
}
