import { SettingService } from '@services/setting.service';
import ComponentToast from '@components/elements/toast';
import {
  ISettingGetResultService,
  ISettingUpdateSEOParamService,
} from 'types/services/setting.service';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { ISettingSeoContentModel } from 'types/models/setting.model';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useReducer, useState } from 'react';
import { useFormReducer } from '@library/react/handles/form';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import ComponentForm from '@components/elements/form';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentFormTags from '@components/elements/form/input/tags';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import ComponentThemeContentLanguage from '@components/theme/contentLanguage';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';

type IComponentState = {
  langId: string;
  item?: ISettingGetResultService;
  isItemLoading: boolean;
};

const initialState: IComponentState = {
  langId: '',
  item: undefined,
  isItemLoading: false,
};

enum ActionTypes {
  SET_LANG_ID,
  SET_ITEM,
  SET_IS_ITEM_LOADING,
}

type IAction =
  | { type: ActionTypes.SET_ITEM; payload: IComponentState['item'] }
  | {
      type: ActionTypes.SET_IS_ITEM_LOADING;
      payload: IComponentState['isItemLoading'];
    }
  | { type: ActionTypes.SET_LANG_ID; payload: IComponentState['langId'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    case ActionTypes.SET_LANG_ID:
      return { ...state, langId: action.payload };
    case ActionTypes.SET_IS_ITEM_LOADING:
      return { ...state, isItemLoading: action.payload };
  }
};

type IComponentFormState = ISettingUpdateSEOParamService;

const initialFormState: IComponentFormState = {
  seoContents: {
    langId: '',
    title: '',
    content: '',
    tags: [],
  },
};

export default function PageSettingsSEO() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer<IComponentFormState>(initialFormState);
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
    if (
      PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission: SettingsEndPointPermission.UPDATE_SEO,
      })
    ) {
      setPageTitle();
      await getSeo();
      setIsPageLoaded(true);
    }
  };

  const onChangeLanguage = async (langId: string) => {
    dispatch({ type: ActionTypes.SET_IS_ITEM_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_LANG_ID, payload: langId });
    await getSeo(langId);
    dispatch({ type: ActionTypes.SET_IS_ITEM_LOADING, payload: false });
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('settings'),
          url: EndPoints.SETTINGS_WITH.GENERAL,
        },
        {
          title: t('seo'),
        },
      ])
    );
  };

  const getSeo = async (_langId?: string) => {
    _langId = _langId ?? state.langId;
    const serviceResult = await SettingService.get(
      {
        langId: _langId,
        projection: SettingProjectionKeys.SEO,
      },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const setting = serviceResult.data;
      dispatch({ type: ActionTypes.SET_ITEM, payload: setting });
      setFormState({
        seoContents: {
          ...formState.seoContents,
          ...setting.seoContents,
          langId: _langId,
        },
      });
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let params = formState;

    const serviceResult = await SettingService.updateSeo(
      params,
      abortController.signal
    );

    if (serviceResult.status) {
      if (
        (state.item?.seoContentAlternates?.indexOfKey('langId', state.langId) ??
          -1) < 0
      ) {
        const newItem: IComponentState['item'] = {
          ...state.item!,
          seoContentAlternates: [
            ...(state.item?.seoContentAlternates ?? []),
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
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: t('seoUpdated'),
      });
    }
  };

  const Header = () => {
    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-6 align-content-center"></div>
          <div className="col-md-6">
            <ComponentThemeContentLanguage
              onChange={(item) => onChangeLanguage(item.value._id)}
              selectedLangId={state.langId}
              showMissingMessage
              ownedLanguages={state.item?.seoContentAlternates}
            />
          </div>
        </div>
      </div>
    );
  };

  return isPageLoading ? null : (
    <div className="page-settings">
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
                  <div className="row">
                    <div className="col-md-7 mb-3">
                      <ComponentFormType
                        title={t('websiteTitle')}
                        type="text"
                        name="seoContents.title"
                        required={true}
                        maxLength={50}
                        value={formState.seoContents.title}
                        onChange={(event) => onChangeInput(event)}
                      />
                    </div>
                    <div className="col-md-7 mb-3">
                      <ComponentFormType
                        title={t('websiteDescription')}
                        type="textarea"
                        name="seoContents.content"
                        required={true}
                        maxLength={120}
                        value={formState.seoContents.content}
                        onChange={(event) => onChangeInput(event)}
                      />
                    </div>
                    <div className="col-md-7">
                      <ComponentFormTags
                        title={t('websiteTags')}
                        placeHolder={t('writeAndPressEnter')}
                        name="seoContents.tags"
                        value={formState.seoContents.tags ?? []}
                        onChange={(value, name) => onChangeSelect(name, value)}
                      />
                    </div>
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
