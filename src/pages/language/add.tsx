import { Tab, Tabs } from 'react-bootstrap';
import {
  ILanguageGetResultService,
  ILanguageUpdateWithIdParamService,
} from 'types/services/language.service';
import { LanguageService } from '@services/language.service';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import { PermissionUtil } from '@utils/permission.util';
import { LanguageEndPointPermission } from '@constants/endPointPermissions/language.endPoint.permission';
import { StatusId } from '@constants/status';
import { SelectUtil } from '@utils/select.util';
import { EndPoints } from '@constants/endPoints';
import { RouteUtil } from '@utils/route.util';
import React, { useReducer, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useRouter } from 'next/router';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentThemeForm from '@components/theme/form';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LanguageSchema } from 'schemas/language.schema';
import ComponentPageLanguageAddHeader from '@components/pages/language/add/header';
import ComponentPageLanguageAddTabGeneral from '@components/pages/language/add/tabGeneral';
import ComponentPageLanguageAddTabOptions from '@components/pages/language/add/tabOptions';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

export type IPageLanguageAddState = {
  mainTabActiveKey: string;
  status: IComponentInputSelectData[];
  flags: IComponentInputSelectData[];
  item?: ILanguageGetResultService;
};

const initialState: IPageLanguageAddState = {
  mainTabActiveKey: `general`,
  status: [],
  flags: [],
};

enum ActionTypes {
  SET_STATUS,
  SET_FLAGS,
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_MAIN_TITLE,
  SET_ITEM,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_STATUS, IPageLanguageAddState['status']>
  | IActionWithPayload<ActionTypes.SET_FLAGS, IPageLanguageAddState['flags']>
  | IActionWithPayload<
      ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
      IPageLanguageAddState['mainTabActiveKey']
    >
  | IActionWithPayload<ActionTypes.SET_ITEM, IPageLanguageAddState['item']>;

const reducer = (
  state: IPageLanguageAddState,
  action: IAction
): IPageLanguageAddState => {
  switch (action.type) {
    case ActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case ActionTypes.SET_FLAGS:
      return { ...state, flags: action.payload };
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    default:
      return state;
  }
};

export type IPageFormState = ILanguageUpdateWithIdParamService;

const initialFormState: IPageFormState = {
  _id: '',
  statusId: StatusId.Active,
  locale: '',
  shortKey: '',
  title: '',
  image: '',
  rank: 0,
  isDefault: false,
};

type IPageQueries = {
  _id?: string;
};

export default function PageSettingLanguageAdd() {
  const abortControllerRef = React.useRef(new AbortController());

  const appDispatch = useAppDispatch();
  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const queries = router.query as IPageQueries;

  const [state, dispatch] = useReducer(reducer, initialState);
  const form = useForm<IPageFormState>({
    defaultValues: {
      ...initialFormState,
      _id: queries._id ?? '',
    },
    resolver: zodResolver(
      queries._id ? LanguageSchema.putWithId : LanguageSchema.post
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
      ? LanguageEndPointPermission.UPDATE
      : LanguageEndPointPermission.ADD;
    if (
      await PermissionUtil.checkAndRedirect({
        t,
        sessionAuth,
        router,
        minPermission,
        showToast,
      })
    ) {
      await getFlags();
      getStatus();
      if (queries._id) {
        await getItem();
      }
      setPageTitle();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    const breadCrumbs: IBreadCrumbData[] = [
      { title: t('languages'), url: EndPoints.LANGUAGE_WITH.LIST },
      { title: t(queries._id ? 'edit' : 'add') },
    ];
    if (queries._id) {
      breadCrumbs.push({ title: mainTitleRef.current });
    }
    appDispatch(setBreadCrumbState(breadCrumbs));
  };

  const getStatus = () => {
    dispatch({
      type: ActionTypes.SET_STATUS,
      payload: SelectUtil.getStatus([StatusId.Active, StatusId.Disabled], t),
    });
  };

  const getFlags = async () => {
    const serviceResult = await LanguageService.getFlags(
      {},
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: ActionTypes.SET_FLAGS,
        payload: serviceResult.data.map((item) => ({
          value: item,
          label: item.split('.')[0].toUpperCase(),
        })),
      });
    }
  };

  const getItem = async () => {
    if (queries._id) {
      const serviceResult = await LanguageService.getWithId(
        { _id: queries._id },
        abortControllerRef.current.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const item = serviceResult.data;
        dispatch({ type: ActionTypes.SET_ITEM, payload: item });
        form.reset(item);
        mainTitleRef.current = item.title;
      } else {
        await navigatePage();
      }
    }
  };

  const navigatePage = async (isReload?: boolean) => {
    const path = EndPoints.LANGUAGE_WITH.LIST;
    await RouteUtil.change({ router, path });
    if (isReload) {
      window.location.reload();
    }
  };

  const onSubmit = async (data: IPageFormState) => {
    const params = data;
    const serviceResult = await (params._id
      ? LanguageService.updateWithId(params, abortControllerRef.current.signal)
      : LanguageService.add(params, abortControllerRef.current.signal));

    if (serviceResult.status) {
      showToast({
        type: 'success',
        title: t('successful'),
        content: `${t(params._id ? 'itemEdited' : 'itemAdded')}!`,
      });
      await navigatePage(true);
    }
  };

  const formValues = form.getValues();

  return isPageLoading ? null : (
    <div className="page-post">
      <div className="row mb-3">
        <ComponentPageLanguageAddHeader onNavigatePage={() => navigatePage()} />
      </div>
      <div className="row">
        <ComponentThemeForm
          formMethods={form}
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
                      <ComponentPageLanguageAddTabGeneral
                        flags={state.flags}
                        image={formValues.image}
                      />
                    </Tab>
                    <Tab eventKey="options" title={t('options')}>
                      <ComponentPageLanguageAddTabOptions
                        status={state.status}
                        statusId={formValues.statusId}
                      />
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </ComponentThemeForm>
      </div>
    </div>
  );
}
