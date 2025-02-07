import React, { FormEvent, useReducer, useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import {
  INavigationGetResultService,
  INavigationUpdateWithIdParamService,
} from 'types/services/navigation.service';
import { NavigationService } from '@services/navigation.service';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import { PermissionUtil } from '@utils/permission.util';
import { NavigationEndPointPermission } from '@constants/endPointPermissions/navigation.endPoint.permission';
import { SelectUtil } from '@utils/select.util';
import { StatusId } from '@constants/status';
import { EndPoints } from '@constants/endPoints';
import { RouteUtil } from '@utils/route.util';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentForm from '@components/elements/form';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavigationSchema } from 'schemas/navigation.schema';
import ComponentPageNavigationAddHeader from '@components/pages/navigation/add/header';
import ComponentPageNavigationAddTabGeneral from '@components/pages/navigation/add/tabGeneral';
import ComponentPageNavigationAddTabOptions from '@components/pages/navigation/add/tabOptions';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

export type IPageNavigationAddState = {
  items: IComponentInputSelectData<string>[];
  mainTabActiveKey: string;
  status: IComponentInputSelectData<StatusId>[];
  item?: INavigationGetResultService;
  langId: string;
  isItemLoading: boolean;
};

const initialState: IPageNavigationAddState = {
  mainTabActiveKey: `general`,
  items: [],
  status: [],
  langId: '',
  isItemLoading: false,
};

enum ActionTypes {
  SET_ITEMS,
  SET_STATUS,
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_LANG_ID,
  SET_ITEM,
  SET_IS_ITEM_LOADING,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_ITEMS, IPageNavigationAddState['items']>
  | IActionWithPayload<
      ActionTypes.SET_STATUS,
      IPageNavigationAddState['status']
    >
  | IActionWithPayload<
      ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
      IPageNavigationAddState['mainTabActiveKey']
    >
  | IActionWithPayload<
      ActionTypes.SET_LANG_ID,
      IPageNavigationAddState['langId']
    >
  | IActionWithPayload<
      ActionTypes.SET_IS_ITEM_LOADING,
      IPageNavigationAddState['isItemLoading']
    >
  | IActionWithPayload<ActionTypes.SET_ITEM, IPageNavigationAddState['item']>;

const reducer = (
  state: IPageNavigationAddState,
  action: IAction
): IPageNavigationAddState => {
  switch (action.type) {
    case ActionTypes.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    case ActionTypes.SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return {
        ...state,
        mainTabActiveKey: action.payload,
      };
    case ActionTypes.SET_ITEM:
      return {
        ...state,
        item: action.payload,
      };
    case ActionTypes.SET_IS_ITEM_LOADING:
      return {
        ...state,
        isItemLoading: action.payload,
      };
    case ActionTypes.SET_LANG_ID:
      return {
        ...state,
        langId: action.payload,
      };
    default:
      return state;
  }
};

export type IPageFormState = INavigationUpdateWithIdParamService;

const initialFormState: IPageFormState = {
  _id: '',
  statusId: StatusId.Active,
  rank: 0,
  contents: {
    langId: '',
    title: '',
    url: '',
  },
};

type IPageQueries = {
  _id?: string;
};

export default function PageNavigationAdd() {
  const abortControllerRef = React.useRef(new AbortController());

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
  const form = useForm<IPageFormState>({
    defaultValues: {
      ...initialFormState,
      _id: queries._id ?? '',
      contents: {
        ...initialFormState.contents,
        langId: mainLangId,
      },
    },
    resolver: zodResolver(
      queries._id ? NavigationSchema.putWithId : NavigationSchema.post
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
    if (isPageLoaded) {
      appDispatch(setIsPageLoadingState(false));
    }
  }, [isPageLoaded]);

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    const minPermission = queries._id
      ? NavigationEndPointPermission.UPDATE
      : NavigationEndPointPermission.ADD;
    if (
      await PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission,
        showToast,
      })
    ) {
      await getItems();
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
    const titles: IBreadCrumbData[] = [
      {
        title: t('navigations'),
        url: EndPoints.NAVIGATION_WITH.LIST,
      },
      {
        title: t(queries._id ? 'edit' : 'add'),
      },
    ];
    if (queries._id) {
      titles.push({ title: mainTitleRef.current });
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
    const serviceResult = await NavigationService.getMany(
      {
        langId: mainLangId,
        statusId: StatusId.Active,
      },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      let newItems: IPageNavigationAddState['items'] = [
        { value: '', label: t('notSelected') },
      ];
      for (const item of serviceResult.data) {
        if (item._id === queries._id) continue;
        newItems.push({
          value: item._id,
          label: item.contents?.title || t('[noLangAdd]'),
        });
      }
      form.setValue('rank', newItems.length);
      dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
    }
  };

  const getItem = async (_langId?: string) => {
    _langId = _langId || state.langId;
    if (queries._id) {
      const serviceResult = await NavigationService.getWithId(
        {
          _id: queries._id,
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
          mainTitleRef.current = item.contents?.title ?? '';
        }
      } else {
        await navigatePage();
      }
    }
  };

  const navigatePage = async () => {
    const path = EndPoints.NAVIGATION_WITH.LIST;
    await RouteUtil.change({ router, path });
  };

  const onSubmit = async (data: IPageFormState) => {
    const params = data;
    const serviceResult = await (params._id
      ? NavigationService.updateWithId(
          params,
          abortControllerRef.current.signal
        )
      : NavigationService.add(params, abortControllerRef.current.signal));

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
          const newItem: IPageNavigationAddState['item'] = {
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

  const formValues = form.getValues();

  return isPageLoading ? null : (
    <div className="page-post">
      <div className="row mb-3">
        <ComponentPageNavigationAddHeader
          langId={state.langId}
          item={state.item}
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
                        <ComponentPageNavigationAddTabGeneral
                          items={state.items}
                          parentId={formValues.parentId}
                        />
                      </Tab>
                      <Tab eventKey="options" title={t('options')}>
                        <ComponentPageNavigationAddTabOptions
                          status={state.status}
                          statusId={formValues.statusId}
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
