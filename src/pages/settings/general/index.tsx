import { SettingService } from '@services/setting.service';
import { ServerInfoService } from '@services/serverInfo.service';
import { ISettingUpdateGeneralParamService } from 'types/services/setting.service';
import { Tab, Tabs } from 'react-bootstrap';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import { IServerInfoGetResultService } from 'types/services/serverInfo.service';
import { LocalStorageUtil } from '@utils/localStorage.util';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { PanelLanguageId, panelLanguages } from '@constants/panelLanguages';
import { SelectUtil } from '@utils/select.util';
import { UserRoleId } from '@constants/userRoles';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import React, { useReducer, useState } from 'react';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingSchema } from 'schemas/setting.schema';
import ComponentPageSettingsGeneralTabGeneral from '@components/pages/settings/general/tabGeneral';
import ComponentPageSettingsGeneralTabContact from '@components/pages/settings/general/tabContact';
import ComponentPageSettingsGeneralTabTools from '@components/pages/settings/general/tabTools';
import ComponentPageSettingsGeneralServerInfo from '@components/pages/settings/general/serverInfo';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';

export type IPageSettingsGeneralState = {
  panelLanguages: IComponentInputSelectData[];
  serverInfo: IServerInfoGetResultService;
  mainTabActiveKey: string;
  isServerInfoLoading: boolean;
};

const initialState: IPageSettingsGeneralState = {
  panelLanguages: [],
  serverInfo: {
    cpu: '0',
    storage: '0',
    memory: '0',
  },
  mainTabActiveKey: `general`,
  isServerInfoLoading: true,
};

enum ActionTypes {
  SET_PANEL_LANGUAGES,
  SET_SERVER_INFO,
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_IS_SERVER_INFO_LOADING,
}

type IAction =
  | IActionWithPayload<
      ActionTypes.SET_PANEL_LANGUAGES,
      IPageSettingsGeneralState['panelLanguages']
    >
  | IActionWithPayload<
      ActionTypes.SET_SERVER_INFO,
      IPageSettingsGeneralState['serverInfo']
    >
  | IActionWithPayload<
      ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
      IPageSettingsGeneralState['mainTabActiveKey']
    >
  | IActionWithPayload<
      ActionTypes.SET_IS_SERVER_INFO_LOADING,
      IPageSettingsGeneralState['isServerInfoLoading']
    >;

const reducer = (
  state: IPageSettingsGeneralState,
  action: IAction
): IPageSettingsGeneralState => {
  switch (action.type) {
    case ActionTypes.SET_PANEL_LANGUAGES:
      return { ...state, panelLanguages: action.payload };
    case ActionTypes.SET_SERVER_INFO:
      return { ...state, serverInfo: action.payload };
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_IS_SERVER_INFO_LOADING:
      return { ...state, isServerInfoLoading: action.payload };
    default:
      return state;
  }
};

type IPageFormState = ISettingUpdateGeneralParamService & {
  panelLangId: number;
};

const initialFormState: IPageFormState = {
  contact: {},
  panelLangId: PanelLanguageId.English,
};

export default function PageSettingsGeneral() {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    panelLanguages: SelectUtil.getPanelLanguages(),
  });
  const form = useForm<IPageFormState>({
    defaultValues: {
      ...initialFormState,
      panelLangId: LocalStorageUtil.getLanguageId(),
    },
    resolver: zodResolver(SettingSchema.putGeneral),
  });
  const { showToast } = useToast();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

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
    if (
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission: SettingsEndPointPermission.UPDATE_GENERAL,
        showToast,
      })
    ) {
      setPageTitle();
      getServerDetails();
      await getSettings();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('settings'),
        },
        {
          title: t('general'),
        },
      ])
    );
  };

  const getSettings = async () => {
    const serviceResult = await SettingService.get(
      { projection: SettingProjectionKeys.General },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const setting = serviceResult.data;
      form.reset({
        ...form.getValues(),
        ...setting,
      });
    }
  };

  const getServerDetails = async () => {
    const serviceResult = await ServerInfoService.get(
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      dispatch({
        type: ActionTypes.SET_SERVER_INFO,
        payload: serviceResult.data,
      });
      dispatch({
        type: ActionTypes.SET_IS_SERVER_INFO_LOADING,
        payload: false,
      });
    }
  };

  const onSubmit = async (data: IPageFormState) => {
    let params = data;

    const serviceResult = await SettingService.updateGeneral(
      params,
      abortControllerRef.current.signal
    );
    if (serviceResult.status) {
      showToast({
        type: 'success',
        title: t('successful'),
        content: t('settingsUpdated'),
      });
    }

    if (params.panelLangId != LocalStorageUtil.getLanguageId()) {
      const panelLanguage = panelLanguages.findSingle('id', params.panelLangId);
      if (panelLanguage) {
        LocalStorageUtil.setLanguageId(params.panelLangId);
        window.location.reload();
      }
    }
  };

  const formValues = form.getValues();
  const isUserSuperAdmin = PermissionUtil.checkPermissionRoleRank(
    sessionAuth!.user.roleId,
    UserRoleId.SuperAdmin
  );

  return isPageLoading ? null : (
    <div className="page-settings">
      <div className="row">
        <ComponentPageSettingsGeneralServerInfo
          info={state.serverInfo}
          isLoading={state.isServerInfoLoading}
        />
      </div>
      <div className="row">
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
                        <ComponentPageSettingsGeneralTabGeneral
                          panelLanguages={state.panelLanguages}
                          panelLangId={formValues.panelLangId}
                          icon={formValues.icon}
                          logo={formValues.logo}
                          logoTwo={formValues.logoTwo}
                        />
                      </Tab>
                      <Tab eventKey="contact" title={t('contact')}>
                        <ComponentPageSettingsGeneralTabContact
                          contact={formValues.contact}
                        />
                      </Tab>
                      {isUserSuperAdmin ? (
                        <Tab eventKey="tools" title={t('tools')}>
                          <ComponentPageSettingsGeneralTabTools />
                        </Tab>
                      ) : null}
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
