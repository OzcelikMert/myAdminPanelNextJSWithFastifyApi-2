import { SettingService } from '@services/setting.service';
import { ServerInfoService } from '@services/serverInfo.service';
import ComponentToast from '@components/elements/toast';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import {
  ISettingGetResultService,
  ISettingUpdateGeneralParamService,
} from 'types/services/setting.service';
import { Tab, Tabs } from 'react-bootstrap';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import { IServerInfoGetResultService } from 'types/services/serverInfo.service';
import { LocalStorageUtil } from '@utils/localStorage.util';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { panelLanguages } from '@constants/panelLanguages';
import { ComponentUtil } from '@utils/component.util';
import { UserRoleId } from '@constants/userRoles';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useEffect, useReducer } from 'react';
import { useFormReducer } from '@library/react/handles/form';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import { useDidMountHook } from '@library/react/customHooks';

type IComponentState = {
  panelLanguages: IThemeFormSelectData[];
  serverInfo: IServerInfoGetResultService;
  mainTabActiveKey: string;
  isServerInfoLoading: boolean;
};

const initialState: IComponentState = {
  panelLanguages: [],
  serverInfo: {
    cpu: '0',
    storage: '0',
    memory: '0',
  },
  mainTabActiveKey: `general`,
  isServerInfoLoading: true,
};

type IAction =
  | { type: 'SET_PANEL_LANGUAGES'; payload: IComponentState['panelLanguages'] }
  | { type: 'SET_SERVER_INFO'; payload: IComponentState['serverInfo'] }
  | {
      type: 'SET_MAIN_TAB_ACTIVE_KEY';
      payload: IComponentState['mainTabActiveKey'];
    }
  | {
      type: 'SET_IS_SERVER_INFO_LOADING';
      payload: IComponentState['isServerInfoLoading'];
    };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_PANEL_LANGUAGES':
      return { ...state, panelLanguages: action.payload };
    case 'SET_SERVER_INFO':
      return { ...state, serverInfo: action.payload };
    case 'SET_MAIN_TAB_ACTIVE_KEY':
      return { ...state, mainTabActiveKey: action.payload };
    case 'SET_IS_SERVER_INFO_LOADING':
      return { ...state, isServerInfoLoading: action.payload };
    default:
      return state;
  }
};

type IComponentFormState = ISettingUpdateGeneralParamService & {
  panelLangId: string;
};

const initialFormState: IComponentFormState = {
  contact: {},
  panelLangId: '',
};

export default function PageSettingsGeneral() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer({
      ...initialFormState,
      panelLangId: LocalStorageUtil.getLanguageId().toString(),
    });

    useDidMountHook(() => {
    init();
    return () => {
      abortController.abort();
    };
  });

  const init = async () => {
    if (
      PermissionUtil.checkAndRedirect({
        router,
        appDispatch,
        sessionAuth,
        t,
        minPermission: SettingsEndPointPermission.UPDATE_GENERAL,
      })
    ) {
      setPageTitle();
      getServerDetails();
      getPanelLanguages();
      await getSettings();
      appDispatch(setIsPageLoadingState(false));
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
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const setting = serviceResult.data;
      setFormState({
        ...formState,
        ...setting,
      });
    }
  };

  const getPanelLanguages = () => {
    dispatch({
      type: 'SET_PANEL_LANGUAGES',
      payload: ComponentUtil.getPanelLanguageForSelect(panelLanguages),
    });
  };

  const getServerDetails = async () => {
    const serviceResult = await ServerInfoService.get(abortController.signal);
    if (serviceResult.status && serviceResult.data) {
      dispatch({ type: 'SET_SERVER_INFO', payload: serviceResult.data });
      dispatch({ type: 'SET_IS_SERVER_INFO_LOADING', payload: false });
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let params = formState;

    const serviceResult = await SettingService.updateGeneral(
      params,
      abortController.signal
    );
    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: t('settingsUpdated'),
      });
    }

    if (formState.panelLangId != LocalStorageUtil.getLanguageId().toString()) {
      const panelLanguage = panelLanguages.findSingle(
        'id',
        Number(formState.panelLangId)
      );
      if (panelLanguage) {
        LocalStorageUtil.setLanguageId(Number(formState.panelLangId));
        window.location.reload();
      }
    }
  };

  const TabTools = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('head')}
            name="head"
            type="textarea"
            value={formState.head}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('script')}
            name="script"
            type="textarea"
            value={formState.script}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('googleAnalyticURL')}
            name="googleAnalyticURL"
            type="url"
            value={formState.googleAnalyticURL}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
      </div>
    );
  };

  const TabContact = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('email')}
            name="contact.email"
            type="email"
            value={formState.contact?.email}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('phone')}
            name="contact.phone"
            type="tel"
            value={formState.contact?.phone}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('address')}
            name="contact.address"
            type="text"
            value={formState.contact?.address}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('addressMap')}
            name="contact.addressMap"
            type="text"
            value={formState.contact?.addressMap}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
      </div>
    );
  };

  const TabGeneral = () => {
    return (
      <div className="row">
        <div className="col-md-4 mb-3">
          <ComponentFieldSet legend={t('logo')}>
            <ComponentThemeChooseImage
              onSelected={(images) =>
                setFormState({
                  ...formState,
                  logo: images[0],
                })
              }
              isMulti={false}
              isShowReviewImage={true}
              reviewImage={formState.logo}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-4 mb-3">
          <ComponentFieldSet legend={t('logo') + ' - 2'}>
            <ComponentThemeChooseImage
              onSelected={(images) =>
                setFormState({
                  ...formState,
                  logoTwo: images[0],
                })
              }
              isMulti={false}
              isShowReviewImage={true}
              reviewImage={formState.logoTwo}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-4 mb-3">
          <ComponentFieldSet legend={t('icon')}>
            <ComponentThemeChooseImage
              onSelected={(images) =>
                setFormState({
                  ...formState,
                  icon: images[0],
                })
              }
              isMulti={false}
              isShowReviewImage={true}
              reviewImage={formState.icon}
              reviewImageClassName={'post-image'}
            />
          </ComponentFieldSet>
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('adminPanelLanguage').toCapitalizeCase()}
            name="panelLangId"
            isMulti={false}
            isSearchable={false}
            options={state.panelLanguages}
            value={state.panelLanguages.findSingle(
              'value',
              formState.panelLangId
            )}
            onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
          />
        </div>
      </div>
    );
  };

  const ServerInfo = () => {
    return (
      <div className="col-12 grid-margin">
        <div className="card card-statistics">
          <div className="row">
            <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row ">
                  <i className="mdi mdi-harddisk text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">{t('storage')}</p>
                    <div className="fluid-container position-relative">
                      {state.isServerInfoLoading ? (
                        <ComponentSpinnerDonut />
                      ) : (
                        <h3 className="mb-0 font-weight-medium text-dark">
                          {state.serverInfo.storage}%
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                  <i className="mdi mdi-memory text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">{t('memory')}</p>
                    <div className="fluid-container position-relative">
                      {state.isServerInfoLoading ? (
                        <ComponentSpinnerDonut />
                      ) : (
                        <h3 className="mb-0 font-weight-medium text-dark">
                          {state.serverInfo.memory}%
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                  <i className="fa fa-microchip text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">{t('processor')}</p>
                    <div className="fluid-container position-relative">
                      {state.isServerInfoLoading ? (
                        <ComponentSpinnerDonut />
                      ) : (
                        <h3 className="mb-0 font-weight-medium text-dark">
                          {state.serverInfo.cpu}%
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const isUserSuperAdmin = PermissionUtil.checkPermissionRoleRank(
    sessionAuth!.user.roleId,
    UserRoleId.SuperAdmin
  );

  return isPageLoading ? null : (
    <div className="page-settings">
      <div className="row">
        <ServerInfo />
      </div>
      <div className="row">
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
                      <Tab eventKey="contact" title={t('contact')}>
                        <TabContact />
                      </Tab>
                      {isUserSuperAdmin ? (
                        <Tab eventKey="tools" title={t('tools')}>
                          <TabTools />
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
