import React, { useReducer, useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { PostTermService } from '@services/postTerm.service';
import {
  IPostTermGetResultService,
  IPostTermUpdateWithIdParamService,
} from 'types/services/postTerm.service';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import { PostTypeId } from '@constants/postTypes';
import { PostTermTypeId } from '@constants/postTermTypes';
import { PermissionUtil, PostPermissionMethod } from '@utils/permission.util';
import { PostUtil } from '@utils/post.util';
import { StatusId } from '@constants/status';
import { SelectUtil } from '@utils/select.util';
import { RouteUtil } from '@utils/route.util';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostTermSchema } from 'schemas/postTerm.schema';
import { IPostTermModel } from 'types/models/postTerm.model';
import ComponentPagePostTermAddHeader from '@components/pages/post/term/add/header';
import ComponentPagePostTermAddTabGeneral from '@components/pages/post/term/add/tabGeneral';
import ComponentPagePostTermAddTabOptions from '@components/pages/post/term/add/tabOptions';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

export type IPagePostTermAddState = {
  mainTabActiveKey: string;
  items: IComponentInputSelectData<string>[];
  status: IComponentInputSelectData[];
  mainTitle: string;
  langId: string;
  item?: IPostTermGetResultService;
  isItemLoading: boolean;
};

const initialState: IPagePostTermAddState = {
  mainTabActiveKey: 'general',
  items: [],
  status: [],
  mainTitle: '',
  langId: '',
  isItemLoading: false,
};

enum ActionTypes {
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_ITEMS,
  SET_STATUS,
  SET_MAIN_TITLE,
  SET_LANG_ID,
  SET_ITEM,
  SET_IS_ITEM_LOADING,
}

type IAction =
  | IActionWithPayload<
      ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
      IPagePostTermAddState['mainTabActiveKey']
    >
  | IActionWithPayload<ActionTypes.SET_ITEMS, IPagePostTermAddState['items']>
  | IActionWithPayload<ActionTypes.SET_STATUS, IPagePostTermAddState['status']>
  | IActionWithPayload<
      ActionTypes.SET_MAIN_TITLE,
      IPagePostTermAddState['mainTitle']
    >
  | IActionWithPayload<ActionTypes.SET_LANG_ID, IPagePostTermAddState['langId']>
  | IActionWithPayload<ActionTypes.SET_ITEM, IPagePostTermAddState['item']>
  | IActionWithPayload<
      ActionTypes.SET_IS_ITEM_LOADING,
      IPagePostTermAddState['isItemLoading']
    >;

const reducer = (
  state: IPagePostTermAddState,
  action: IAction
): IPagePostTermAddState => {
  switch (action.type) {
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case ActionTypes.SET_MAIN_TITLE:
      return { ...state, mainTitle: action.payload };
    case ActionTypes.SET_LANG_ID:
      return { ...state, langId: action.payload };
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    case ActionTypes.SET_IS_ITEM_LOADING:
      return { ...state, isItemLoading: action.payload };
    default:
      return state;
  }
};

export type IPagePostTermAddFormState = IPostTermUpdateWithIdParamService;

const initialFormState: IPagePostTermAddFormState = {
  _id: '',
  typeId: PostTermTypeId.Category,
  postTypeId: PostTypeId.Blog,
  parentId: '',
  statusId: StatusId.Active,
  rank: 0,
  contents: {
    langId: '',
    image: '',
    title: '',
    url: '',
  },
};

type IPageProps = {
  isModal?: boolean;
  _id?: string;
  postTypeId?: PostTypeId;
  termTypeId?: PostTermTypeId;
  items?: IPagePostTermAddState['items'];
  onSubmit?: (item: IPagePostTermAddFormState) => void;
};

type IPageQueries = {
  _id?: string;
  termTypeId: PostTermTypeId;
  postTypeId: PostTypeId;
};

export default function PagePostTermAdd(props: IPageProps) {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const queries = {
    ...router.query,
    postTypeId: Number(
      router.query.postTypeId ?? props.postTypeId ?? PostTypeId.Blog
    ),
    termTypeId: Number(
      router.query.termTypeId ?? props.termTypeId ?? PostTermTypeId.Category
    ),
  } as IPageQueries;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    langId: mainLangId,
  });
  const form = useForm<IPagePostTermAddFormState>({
    defaultValues: {
      ...initialFormState,
      typeId: queries.termTypeId,
      postTypeId: queries.postTypeId,
      _id: queries._id ?? props._id ?? '',
      contents: {
        ...initialFormState.contents,
        langId: mainLangId,
      },
    },
    resolver: zodResolver(
      queries._id ? PostTermSchema.putWithId : PostTermSchema.post
    ),
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
    if (isPageLoaded && !props.isModal) {
      appDispatch(setIsPageLoadingState(false));
    }
  }, [isPageLoaded]);

  useEffectAfterDidMount(() => {
    if (isPageLoaded) {
      init();
    }
  }, [props.postTypeId, props.termTypeId]);

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
        [PostTermTypeId.Category, PostTermTypeId.Variations].includes(
          queries.termTypeId
        )
      ) {
        await getItems();
      }
      getStatus();
      if (queries._id) {
        await getItem();
      }
      if (!props.isModal) {
        setPageTitle();
      }
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
      termTypeId: queries.termTypeId,
    });

    if (queries._id) {
      titles.push({ title: 'edit' });
      titles.push({ title: mainTitleRef.current });
    } else {
      titles.push({ title: 'add' });
    }

    appDispatch(setBreadCrumbState(titles));
  };

  const getStatus = () => {
    dispatch({
      type: ActionTypes.SET_STATUS,
      payload: SelectUtil.getStatus([StatusId.Active, StatusId.InProgress], t),
    });
  };

  const getItems = async () => {
    if (props.items) {
      dispatch({
        type: ActionTypes.SET_ITEMS,
        payload: [{ value: '', label: t('notSelected') }, ...props.items],
      });
    } else {
      const typeId =
        queries.termTypeId == PostTermTypeId.Variations
          ? PostTermTypeId.Attributes
          : queries.termTypeId;

      const serviceResult = await PostTermService.getMany(
        {
          typeId: [typeId],
          postTypeId: queries.postTypeId,
          langId: mainLangId,
          statusId: StatusId.Active,
          ignoreTermId: state.items.map((item) => item.value),
        },
        abortControllerRef.current.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const newItems: IPagePostTermAddState['items'] = [
          { value: '', label: t('notSelected') },
        ];
        if (state.items.length) {
          newItems.push(...state.items);
        }
        for (const item of serviceResult.data) {
          if (item._id === queries._id) continue;
          newItems.push({
            value: item._id,
            label: item.contents?.title || t('[noLangAdd]'),
          });
        }
        dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
      }
    }
  };

  const getItem = async (_langId?: string) => {
    _langId = _langId || state.langId;
    if (queries._id) {
      const serviceResult = await PostTermService.getWithId(
        {
          _id: queries._id,
          typeId: queries.termTypeId,
          postTypeId: queries.postTypeId,
          langId: _langId,
        },
        abortControllerRef.current.signal
      );

      if (serviceResult.status && serviceResult.data) {
        const item = serviceResult.data;
        dispatch({ type: ActionTypes.SET_ITEM, payload: item });
        form.reset({
          ...item,
          parentId: item.parentId || '',
          contents: {
            ...item.contents,
            langId: _langId,
          },
        });
        if (_langId == mainLangId) {
          mainTitleRef.current = item.contents?.title || '';
        }
      } else {
        await navigatePage();
      }
    }
  };

  const navigatePage = async () => {
    const postTypeId = queries.postTypeId;
    const postTermTypeId = queries.termTypeId;
    const pagePath = PostUtil.getPagePath(postTypeId);
    const path = pagePath.TERM_WITH(postTermTypeId).LIST;
    RouteUtil.change({ router, path });
  };

  const onSubmit = async (data: IPagePostTermAddFormState) => {
    const params = data;
    const serviceResult = await (params._id
      ? PostTermService.updateWithId(params, abortControllerRef.current.signal)
      : PostTermService.add(params, abortControllerRef.current.signal));

    if (serviceResult.status) {
      if (
        [PostTermTypeId.Category, PostTermTypeId.Variations].includes(
          params.typeId
        )
      ) {
        if (!params._id && serviceResult.data) {
          const newItem = serviceResult.data as IPostTermModel;
          dispatch({
            type: ActionTypes.SET_ITEMS,
            payload: [
              ...state.items,
              {
                value: newItem._id,
                label: newItem.contents.title || t('[noLangAdd]'),
              },
            ],
          });
        }
      }

      showToast({
        type: 'success',
        title: t('successful'),
        content: `${t(params._id ? 'itemEdited' : 'itemAdded')}!`,
      });

      if (props.onSubmit) {
        props.onSubmit(params);
      }

      if (!props.isModal && params._id) {
        await navigatePage();
      } else if (!params._id) {
        form.reset({
          ...initialFormState,
          typeId: params.typeId,
          postTypeId: params.postTypeId,
        });
      }
    }
  };

  const formValues = form.getValues();

  return isPageLoading ? null : (
    <div className="page-post-term">
      <div className="row mb-3">
        {!props.isModal ? (
          <ComponentPagePostTermAddHeader
            item={state.item}
            langId={state.langId}
            views={formValues.contents.views}
            showLanguageSelector={formValues._id ? true : false}
            onChangeLanguage={(_id) => onChangeLanguage(_id)}
            onNavigatePage={() => navigatePage()}
          />
        ) : null}
      </div>
      <div className="row position-relative">
        {state.isItemLoading || !isPageLoaded ? (
          <ComponentSpinnerDonut customClass="page-spinner" />
        ) : null}
        <div className="col-md-12">
          <ComponentForm
            formMethods={form}
            i18={{
              submitButtonText: t('save'),
              submitButtonSubmittingText: t('loading'),
            }}
            onSubmit={(data) => onSubmit(data)}
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
                        <ComponentPagePostTermAddTabGeneral
                          items={state.items}
                          termTypeId={formValues.typeId}
                          image={formValues.contents.image}
                          parentId={formValues.parentId}
                          isModal={props.isModal}
                          showParentSelect={[
                            PostTermTypeId.Category,
                            PostTermTypeId.Variations,
                          ].includes(formValues.typeId)}
                        />
                      </Tab>
                      <Tab eventKey="options" title={t('options')}>
                        <ComponentPagePostTermAddTabOptions
                          status={state.status}
                          statusId={formValues.statusId}
                          isModal={props.isModal}
                        />
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </ComponentForm>
        </div>
      </div>
    </div>
  );
}
