import { FormEvent, useEffect, useReducer, useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import {
  INavigationGetResultService,
  INavigationUpdateWithIdParamService,
} from 'types/services/navigation.service';
import { NavigationService } from '@services/navigation.service';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import { PermissionUtil } from '@utils/permission.util';
import { NavigationEndPointPermission } from '@constants/endPointPermissions/navigation.endPoint.permission';
import { ComponentUtil } from '@utils/component.util';
import { StatusId } from '@constants/status';
import { EndPoints } from '@constants/endPoints';
import { RouteUtil } from '@utils/route.util';
import ComponentToast from '@components/elements/toast';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormReducer } from '@library/react/handles/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentForm from '@components/elements/form';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import ComponentThemeContentLanguage from '@components/theme/contentLanguage';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';

type IComponentState = {
  items: IThemeFormSelectData<string>[];
  mainTabActiveKey: string;
  status: IThemeFormSelectData<StatusId>[];
  item?: INavigationGetResultService;
  langId: string;
  isItemLoading: boolean;
};

const initialState: IComponentState = {
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
  | { type: ActionTypes.SET_ITEMS; payload: IComponentState['items'] }
  | { type: ActionTypes.SET_STATUS; payload: IComponentState['status'] }
  | {
      type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IComponentState['mainTabActiveKey'];
    }
  | { type: ActionTypes.SET_LANG_ID; payload: IComponentState['langId'] }
  | {
      type: ActionTypes.SET_IS_ITEM_LOADING;
      payload: IComponentState['isItemLoading'];
    }
  | { type: ActionTypes.SET_ITEM; payload: IComponentState['item'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
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

type IComponentFormState = INavigationUpdateWithIdParamService;

const initialFormState: IComponentFormState = {
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
    useFormReducer<IComponentFormState>({
      ...initialFormState,
      _id: queries._id || '',
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
    const minPermission = formState._id
      ? NavigationEndPointPermission.UPDATE
      : NavigationEndPointPermission.ADD;
    if (
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission,
      })
    ) {
      await getItems();
      getStatus();
      if (formState._id) {
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
        title: t(formState._id ? 'edit' : 'add'),
      },
    ];
    if (formState._id) {
      titles.push({ title: mainTitleRef.current });
    }
    appDispatch(setBreadCrumbState(titles));
  };

  const getStatus = () => {
    dispatch({
      type: ActionTypes.SET_STATUS,
      payload: ComponentUtil.getStatusForSelect(
        [StatusId.Active, StatusId.InProgress],
        t
      ),
    });
  };

  const getItems = async () => {
    const serviceResult = await NavigationService.getMany(
      {
        langId: mainLangId,
        statusId: StatusId.Active,
      },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      let newItems: IComponentState['items'] = [
        { value: '', label: t('notSelected') },
      ];
      for (const item of serviceResult.data) {
        if (item._id === formState._id) continue;
        newItems.push({
          value: item._id,
          label: item.contents?.title || t('[noLangAdd]'),
        });
      }
      setFormState({ rank: newItems.length });
      dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
    }
  };

  const getItem = async (_langId?: string) => {
    if (formState._id) {
      _langId = _langId || state.langId;

      const serviceResult = await NavigationService.getWithId(
        {
          _id: formState._id,
          langId: _langId,
        },
        abortController.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const item = serviceResult.data;
        dispatch({ type: ActionTypes.SET_ITEM, payload: item });
        setFormState({
          ...item,
          parentId: item.parentId?._id || '',
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

  const onSubmit = async (event: FormEvent) => {
    const params = formState;
    const serviceResult = await (formState._id
      ? NavigationService.updateWithId(params, abortController.signal)
      : NavigationService.add(params, abortController.signal));

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
          const newItem: IComponentState['item'] = {
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
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('status')}
            name="statusId"
            options={state.status}
            value={state.status?.findSingle('value', formState.statusId)}
            onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('rank')}
            name="rank"
            type="number"
            required={true}
            value={formState.rank}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7">
          <ComponentFormCheckBox
            title={t('primary')}
            name="isPrimary"
            checked={Boolean(formState.isPrimary)}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7">
          <ComponentFormCheckBox
            title={t('secondary')}
            name="isSecondary"
            checked={Boolean(formState.isSecondary)}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
      </div>
    );
  };

  const TabGeneral = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('title')}*`}
            name="contents.title"
            type="text"
            required={true}
            value={formState.contents.title}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('url')}*`}
            name="contents.url"
            type="text"
            required={true}
            value={formState.contents.url}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('main')}
            name="parentId"
            placeholder={t('chooseMain')}
            options={state.items}
            value={state.items.findSingle('value', formState.parentId || '')}
            onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
          />
        </div>
      </div>
    );
  };

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
                          type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
                          payload: key,
                        })
                      }
                      activeKey={state.mainTabActiveKey}
                      className="mb-5"
                      transition={false}
                    >
                      <Tab eventKey="general" title={t('general')}>
                        <TabGeneral />
                      </Tab>
                      <Tab eventKey="options" title={t('options')}>
                        <TabOptions />
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
