import { Tab, Tabs } from 'react-bootstrap';
import {
  ILanguageGetResultService,
  ILanguageUpdateWithIdParamService,
} from 'types/services/language.service';
import { LanguageService } from '@services/language.service';
import Image from 'next/image';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import { PermissionUtil } from '@utils/permission.util';
import { LanguageEndPointPermission } from '@constants/endPointPermissions/language.endPoint.permission';
import { StatusId } from '@constants/status';
import { ComponentUtil } from '@utils/component.util';
import { EndPoints } from '@constants/endPoints';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { RouteUtil } from '@utils/route.util';
import ComponentToast from '@components/elements/toast';
import { FormEvent, useEffect, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useRouter } from 'next/router';
import { useFormReducer } from '@library/react/handles/form';
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
import { setIsPageLoadingState } from '@redux/features/pageSlice';

type IComponentState = {
  mainTabActiveKey: string;
  status: IThemeFormSelectData[];
  flags: IThemeFormSelectData[];
  mainTitle: string;
  item?: ILanguageGetResultService;
};

const initialState: IComponentState = {
  mainTabActiveKey: `general`,
  status: [],
  flags: [],
  mainTitle: '',
};

enum ActionTypes {
  SET_STATUS,
  SET_FLAGS,
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_MAIN_TITLE,
  SET_ITEM,
}

type IAction =
  | { type: ActionTypes.SET_STATUS; payload: IComponentState['status'] }
  | { type: ActionTypes.SET_FLAGS; payload: IComponentState['flags'] }
  | {
      type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IComponentState['mainTabActiveKey'];
    }
  | { type: ActionTypes.SET_MAIN_TITLE; payload: IComponentState['mainTitle'] }
  | { type: ActionTypes.SET_ITEM; payload: IComponentState['item'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case ActionTypes.SET_FLAGS:
      return { ...state, flags: action.payload };
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_MAIN_TITLE:
      return { ...state, mainTitle: action.payload };
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    default:
      return state;
  }
};

type IComponentFormState = ILanguageUpdateWithIdParamService;

const initialFormState: IComponentFormState = {
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
  const abortController = new AbortController();

  const appDispatch = useAppDispatch();
  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const queries = router.query as IPageQueries;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer<IComponentFormState>({
      ...initialFormState,
      _id: queries._id ?? '',
    });
  const [isPageLoaded, setIsPageLoaded] = useState(false);

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
      ? LanguageEndPointPermission.UPDATE
      : LanguageEndPointPermission.ADD;
    if (
      PermissionUtil.checkAndRedirect({
        appDispatch,
        t,
        sessionAuth,
        router,
        minPermission,
      })
    ) {
      await getFlags();
      getStatus();
      if (formState._id) {
        await getItem();
      }
      setPageTitle();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    const breadCrumbs: IBreadCrumbData[] = [
      { title: t('languages'), url: EndPoints.LANGUAGE_WITH.LIST },
      { title: t(formState._id ? 'edit' : 'add') },
    ];
    if (formState._id) {
      breadCrumbs.push({ title: state.mainTitle });
    }
    appDispatch(setBreadCrumbState(breadCrumbs));
  };

  const getStatus = () => {
    dispatch({
      type: ActionTypes.SET_STATUS,
      payload: ComponentUtil.getStatusForSelect(
        [StatusId.Active, StatusId.Disabled],
        t
      ),
    });
  };

  const getFlags = async () => {
    const serviceResult = await LanguageService.getFlags(
      {},
      abortController.signal
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
    if (formState._id) {
      const serviceResult = await LanguageService.getWithId(
        { _id: formState._id },
        abortController.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const item = serviceResult.data;
        dispatch({ type: ActionTypes.SET_ITEM, payload: item });
        setFormState(item);
        dispatch({ type: ActionTypes.SET_MAIN_TITLE, payload: item.title });
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

  const onSubmit = async (event: FormEvent) => {
    const params = formState;
    const serviceResult = await (formState._id
      ? LanguageService.updateWithId(params, abortController.signal)
      : LanguageService.add(params, abortController.signal));

    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `${t(formState._id ? 'itemEdited' : 'itemAdded')}!`,
      });
      await navigatePage(true);
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
            options={state.status}
            name="statusId"
            value={state.status?.findSingle('value', formState.statusId)}
            onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('rank')}*`}
            name="rank"
            type="number"
            required={true}
            value={formState.rank}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormCheckBox
            title={t('default')}
            name="isDefault"
            checked={Boolean(formState.isDefault)}
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
          <div className="row">
            <div className="col-1 m-auto">
              <Image
                src={ImageSourceUtil.getUploadedFlagSrc(formState.image)}
                alt={formState.image}
                className="img-fluid img-sm"
                width={100}
                height={75}
              />
            </div>
            <div className="col-11">
              <ComponentFormSelect
                title={t('image')}
                name="image"
                options={state.flags}
                value={state.flags.findSingle('value', formState.image || '')}
                onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('title')}*`}
            name="title"
            type="text"
            required={true}
            value={formState.title}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('shortKey')}*`}
            name="shortKey"
            type="text"
            required={true}
            value={formState.shortKey}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('locale')}*`}
            name="locale"
            type="text"
            required={true}
            value={formState.locale}
            onChange={(e) => onChangeInput(e)}
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
  );
}
