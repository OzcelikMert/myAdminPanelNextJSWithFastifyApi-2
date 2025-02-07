import { SettingService } from '@services/setting.service';
import {
  ISettingGetResultService,
  ISettingUpdateSEOParamService,
} from 'types/services/setting.service';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import React, { useReducer, useState } from 'react';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import ComponentForm from '@components/elements/form';
import ComponentFormInput from '@components/elements/form/inputs/input';
import ComponentFormInputTags from '@components/elements/form/inputs/tags';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingSchema } from 'schemas/setting.schema';
import ComponentPageSettingsSEOHeader from '@components/pages/settings/seo/header';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from '@hooks/toast';
import { I18Util } from '@utils/i18.util';

export type IPageSettingsSEOState = {
  langId: string;
  item?: ISettingGetResultService;
  isItemLoading: boolean;
};

const initialState: IPageSettingsSEOState = {
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
  | IActionWithPayload<ActionTypes.SET_ITEM, IPageSettingsSEOState['item']>
  | IActionWithPayload<
      ActionTypes.SET_IS_ITEM_LOADING,
      IPageSettingsSEOState['isItemLoading']
    >
  | IActionWithPayload<
      ActionTypes.SET_LANG_ID,
      IPageSettingsSEOState['langId']
    >;

const reducer = (
  state: IPageSettingsSEOState,
  action: IAction
): IPageSettingsSEOState => {
  switch (action.type) {
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    case ActionTypes.SET_LANG_ID:
      return { ...state, langId: action.payload };
    case ActionTypes.SET_IS_ITEM_LOADING:
      return { ...state, isItemLoading: action.payload };
  }
};

type IPageFormState = ISettingUpdateSEOParamService;

const initialFormState: IPageFormState = {
  seoContents: {
    langId: '',
    title: '',
    content: '',
    tags: [],
  },
};

export default function PageSettingsSEO() {
  const abortControllerRef = React.useRef(new AbortController());

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    langId: mainLangId,
  });
  const form = useForm<IPageFormState>({
    defaultValues: {
      ...initialFormState,
      seoContents: {
        ...initialFormState.seoContents,
        langId: mainLangId,
      },
    },
    resolver: zodResolver(SettingSchema.putSeo),
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
      await PermissionUtil.checkAndRedirect({
        router,
        sessionAuth,
        t,
        minPermission: SettingsEndPointPermission.UPDATE_SEO,
        showToast,
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
    _langId = _langId || state.langId;
    const serviceResult = await SettingService.get(
      {
        langId: _langId,
        projection: SettingProjectionKeys.SEO,
      },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const setting = serviceResult.data;
      dispatch({ type: ActionTypes.SET_ITEM, payload: setting });
      form.reset({
        seoContents: {
          ...form.getValues().seoContents,
          ...setting.seoContents,
          langId: _langId,
        },
      });
    }
  };

  const onSubmit = async (data: IPageFormState) => {
    let params = data;

    const serviceResult = await SettingService.updateSeo(
      params,
      abortControllerRef.current.signal
    );

    if (serviceResult.status) {
      if (
        (state.item?.seoContentAlternates?.indexOfKey('langId', state.langId) ??
          -1) < 0
      ) {
        const newItem: IPageSettingsSEOState['item'] = {
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
      showToast({
        type: 'success',
        title: t('successful'),
        content: t('seoUpdated'),
      });
    }
  };

  return isPageLoading ? null : (
    <div className="page-settings">
      <div className="row mb-3">
        <ComponentPageSettingsSEOHeader
          item={state.item}
          langId={state.langId}
          onChangeLanguage={(langId) => onChangeLanguage(langId)}
        />
      </div>
      <div className="row position-relative">
        {state.isItemLoading ? (
          <ComponentSpinnerDonut customClass="page-spinner" />
        ) : null}
        <div className="col-md-12">
          <div className="grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <ComponentForm
                  formMethods={form}
                  i18={{
                    submitButtonText: t('save'),
                    submitButtonSubmittingText: t('loading'),
                  }}
                  onSubmit={(event) => onSubmit(event)}
                >
                  <div className="row">
                    <div className="col-md-7 mb-3">
                      <ComponentFormInput
                        title={t('websiteTitle')}
                        type="text"
                        name="seoContents.title"
                        maxLength={50}
                        i18={{
                          setErrorText: (errorCode) =>
                            t(I18Util.getFormInputErrorText(errorCode), [
                              t('websiteTitle'),
                            ]),
                        }}
                        required
                      />
                    </div>
                    <div className="col-md-7 mb-3">
                      <ComponentFormInput
                        title={t('websiteDescription')}
                        type="textarea"
                        name="seoContents.content"
                        maxLength={120}
                        i18={{
                          setErrorText: (errorCode) =>
                            t(I18Util.getFormInputErrorText(errorCode), [
                              t('websiteDescription'),
                            ]),
                        }}
                        required
                      />
                    </div>
                    <div className="col-md-7">
                      <ComponentFormInputTags
                        title={t('websiteTags')}
                        placeHolder={t('writeAndPressEnter')}
                        name="seoContents.tags"
                      />
                    </div>
                  </div>
                </ComponentForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
