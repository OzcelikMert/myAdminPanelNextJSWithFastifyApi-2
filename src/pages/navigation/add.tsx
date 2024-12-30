import { FormEvent, useEffect, useReducer } from 'react';
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
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useFormReducer } from '@library/react/handles/form';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@lib/features/breadCrumbSlice';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentForm from '@components/elements/form';

type IComponentState = {
  items: IThemeFormSelectData<string>[];
  mainTabActiveKey: string;
  status: IThemeFormSelectData<StatusId>[];
  isSubmitting: boolean;
  mainTitle: string;
  item?: INavigationGetResultService;
  langId: string;
};

const initialState: IComponentState = {
  mainTabActiveKey: `general`,
  items: [],
  status: [],
  isSubmitting: false,
  mainTitle: '',
  langId: '',
};

type IAction =
  | { type: 'SET_ITEMS'; payload: IComponentState['items'] }
  | { type: 'SET_STATUS'; payload: IComponentState['status'] }
  | { type: 'SET_IS_SUBMITTING'; payload: IComponentState['isSubmitting'] }
  | { type: 'SET_MAIN_TITLE'; payload: IComponentState['mainTitle'] }
  | {
      type: 'SET_MAIN_TAB_ACTIVE_KEY';
      payload: IComponentState['mainTabActiveKey'];
    }
  | { type: 'SET_LANG_ID'; payload: IComponentState['langId'] }
  | { type: 'SET_ITEM'; payload: IComponentState['item'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      };
    case 'SET_IS_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };
    case 'SET_MAIN_TITLE':
      return {
        ...state,
        mainTitle: action.payload,
      };
    case 'SET_MAIN_TAB_ACTIVE_KEY':
      return {
        ...state,
        mainTabActiveKey: action.payload,
      };
    case 'SET_ITEM':
      return {
        ...state,
        item: action.payload,
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

  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer(initialFormState);
  const queries = router.query as IPageQueries;

  const init = async () => {
    const minPermission = queries._id
      ? NavigationEndPointPermission.UPDATE
      : NavigationEndPointPermission.ADD;
    if (
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        appDispatch,
        minPermission,
      })
    ) {
      await getItems();
      getStatus();
      if (queries._id) {
        await getItem();
      }
      setPageTitle();
      appDispatch(setIsPageLoadingState(false));
    }
  };

  useEffect(() => {
    init();

    return () => {
      abortController.abort();
    };
  }, []);

  const changeLanguage = async (langId: string) => {
    appDispatch(setIsPageLoadingState(true));
    await getItem(langId);
    appDispatch(setIsPageLoadingState(false));
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
      titles.push({ title: state.mainTitle });
    }
    appDispatch(setBreadCrumbState(titles));
  };

  const getStatus = () => {
    dispatch({
      type: 'SET_STATUS',
      payload: ComponentUtil.getStatusForSelect(
        [StatusId.Active, StatusId.InProgress],
        t
      ),
    });
    setFormState({ statusId: StatusId.Active });
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
      let items: IComponentState['items'] = [
        { value: '', label: t('notSelected') },
      ];
      for (const item of serviceResult.data) {
        if (queries._id && item._id === queries._id) continue;
        items.push({
          value: item._id,
          label: item.contents?.title || t('[noLangAdd]'),
        });
      }
      setFormState({ rank: items.length });
      dispatch({ type: 'SET_ITEMS', payload: items });
    }
  };

  const getItem = async (langId?: string) => {
    if (queries._id) {
      const serviceResult = await NavigationService.getWithId(
        {
          _id: queries._id,
          langId: langId || mainLangId,
        },
        abortController.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const item = serviceResult.data;
        dispatch({ type: 'SET_ITEM', payload: item });
        setFormState({
          parentId: item.parentId?._id || '',
          contents: {
            langId: langId || mainLangId,
          },
        });
        if (!langId) {
          dispatch({
            type: 'SET_MAIN_TITLE',
            payload: item.contents?.title || '',
          });
        }
      } else {
        await navigatePage();
      }
    }
  };

  const navigatePage = async () => {
    const path = EndPoints.NAVIGATION_WITH.LIST;
    await RouteUtil.change({ appDispatch, router, path });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: 'SET_IS_SUBMITTING', payload: true });
    const params = formState;
    const serviceResult = await (queries._id
      ? NavigationService.updateWithId(params, abortController.signal)
      : NavigationService.add(params, abortController.signal));
    dispatch({ type: 'SET_IS_SUBMITTING', payload: false });
    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `${t(queries._id ? 'itemEdited' : 'itemAdded')}!`,
      });
      if (!queries._id) {
        await navigatePage();
      }
    }
  };

  const Header = () => {
    return (
      <div className="col-md-3">
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
              onClick={() => navigatePage()}
            >
              <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
            </button>
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
            onChange={(item: any, e) => onChangeSelect('statusId', item.value)}
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
            onChange={(item: any, e) => onChangeSelect('parentId', item.value)}
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
      <div className="row">
        <ComponentForm
          isActiveSaveButton={true}
          saveButtonText={t('save')}
          saveButtonLoadingText={t('loading')}
          isSubmitting={state.isSubmitting}
          formAttributes={{ onSubmit: (event) => onSubmit(event) }}
        >
          <div className="grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="theme-tabs">
                  <Tabs
                    onSelect={(key: any) =>
                      dispatch({
                        type: 'SET_MAIN_TAB_ACTIVE_KEY',
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
  );
}
