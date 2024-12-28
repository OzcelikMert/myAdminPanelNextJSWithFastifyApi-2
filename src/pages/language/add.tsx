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
import { FormEvent, useEffect, useReducer } from 'react';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useRouter } from 'next/router';
import { useFormReducer } from '@library/react/handles/form';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@lib/features/breadCrumbSlice';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import ComponentForm from '@components/elements/form';

type IComponentState = {
  mainTabActiveKey: string;
  status: IThemeFormSelectData[];
  flags: IThemeFormSelectData[];
  isSubmitting: boolean;
  mainTitle: string;
  item?: ILanguageGetResultService;
};

const initialState: IComponentState = {
  mainTabActiveKey: `general`,
  status: [],
  flags: [],
  isSubmitting: false,
  mainTitle: '',
};

type IAction =
  | { type: 'SET_STATUS'; status: IThemeFormSelectData[] }
  | { type: 'SET_FLAGS'; flags: IThemeFormSelectData[] }
  | { type: 'SET_IS_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_MAIN_TAB_ACTIVE_KEY'; mainTabActiveKey: string }
  | { type: 'SET_MAIN_TITLE'; mainTitle: string }
  | { type: 'SET_ITEM'; item: ILanguageGetResultService };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'SET_FLAGS':
      return { ...state, flags: action.flags };
    case 'SET_IS_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'SET_MAIN_TAB_ACTIVE_KEY':
      return { ...state, mainTabActiveKey: action.mainTabActiveKey };
    case 'SET_MAIN_TITLE':
      return { ...state, mainTitle: action.mainTitle };
    case 'SET_ITEM':
      return { ...state, item: action.item };
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

export default function PageSettingLanguageAdd() {
  const abortController = new AbortController();

  const appDispatch = useAppDispatch();
  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer<IComponentFormState>({
      ...initialFormState,
      _id: (router.query._id as string) ?? '',
    });

  const init = async () => {
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
      appDispatch({ type: 'SET_IS_PAGE_LOADING', isPageLoading: false });
    }
  };

  useEffect(() => {
    init();
    return () => {
      abortController.abort();
    };
  }, []);

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
      type: 'SET_STATUS',
      status: ComponentUtil.getStatusForSelect(
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
        type: 'SET_FLAGS',
        flags: serviceResult.data.map((item) => ({
          value: item,
          label: item.split('.')[0].toUpperCase(),
        })),
      });
    }
  };

  const getItem = async () => {
    const serviceResult = await LanguageService.getWithId(
      { _id: formState._id },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const item = serviceResult.data;
      dispatch({ type: 'SET_ITEM', item });
      setFormState(item);
      dispatch({ type: 'SET_MAIN_TITLE', mainTitle: item.title });
    } else {
      await navigatePage();
    }
  };

  const navigatePage = async (isReload?: boolean) => {
    const path = EndPoints.LANGUAGE_WITH.LIST;
    await RouteUtil.change({ router, path, appDispatch });
    if (isReload) {
      window.location.reload();
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: 'SET_IS_SUBMITTING', isSubmitting: true });
    const params = { ...formState };
    const serviceResult = await (params._id
      ? LanguageService.updateWithId(params, abortController.signal)
      : LanguageService.add(params, abortController.signal));
    dispatch({ type: 'SET_IS_SUBMITTING', isSubmitting: false });
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
            value={state.status?.findSingle('value', formState.statusId)}
            onChange={(item: any, e) => onChangeSelect('statusId', item.value)}
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
                onChange={(item: any, e) => onChangeSelect('image', item.value)}
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
                        mainTabActiveKey: key,
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
