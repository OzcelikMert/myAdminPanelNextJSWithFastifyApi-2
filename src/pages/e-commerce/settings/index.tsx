import { SettingService } from '@services/setting.service';
import { ISettingUpdateECommerceParamService } from 'types/services/setting.service';
import { Tab, Tabs } from 'react-bootstrap';
import { CurrencyId, currencyTypes } from '@constants/currencyTypes';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { PermissionUtil } from '@utils/permission.util';
import { ECommerceEndPointPermission } from '@constants/endPointPermissions/eCommerce.endPoint.permission';
import { ISettingECommerceModel } from 'types/models/setting.model';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import React, { useReducer, useState } from 'react';
import { useRouter } from 'next/router';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { setCurrencyIdState } from '@redux/features/settingSlice';
import ComponentForm from '@components/elements/form';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentPageECommerceSettingsTabGeneral from '@components/pages/e-commerce/settings/tabGeneral';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingSchema } from 'schemas/setting.schema';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from 'hooks/toast';

export type IPageECommerceSettingsState = {
  currencyTypes: IComponentInputSelectData[];
  item?: ISettingECommerceModel;
  mainTabActiveKey: string;
};

const initialState: IPageECommerceSettingsState = {
  currencyTypes: [],
  mainTabActiveKey: `general`,
};

enum ActionTypes {
  SET_CURRENCY_TYPES,
  SET_ITEM,
  SET_MAIN_TAB_ACTIVE_KEY,
}

type IAction =
  | IActionWithPayload<
      ActionTypes.SET_CURRENCY_TYPES,
      IPageECommerceSettingsState['currencyTypes']
    >
  | IActionWithPayload<
      ActionTypes.SET_ITEM,
      IPageECommerceSettingsState['item']
    >
  | IActionWithPayload<
      ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
      IPageECommerceSettingsState['mainTabActiveKey']
    >;

const reducer = (
  state: IPageECommerceSettingsState,
  action: IAction
): IPageECommerceSettingsState => {
  switch (action.type) {
    case ActionTypes.SET_CURRENCY_TYPES:
      return {
        ...state,
        currencyTypes: action.payload,
      };
    case ActionTypes.SET_ITEM:
      return {
        ...state,
        item: action.payload,
      };
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return {
        ...state,
        mainTabActiveKey: action.payload,
      };
    default:
      return state;
  }
};

export type IPageFormState = ISettingUpdateECommerceParamService;

const initialFormState: IPageFormState = {
  eCommerce: {
    currencyId: CurrencyId.Dollar,
  },
};

export default function PageECommerceSettings() {
  const abortControllerRef = React.useRef(new AbortController());

  const appDispatch = useAppDispatch();
  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [state, dispatch] = useReducer(reducer, initialState);
  const form = useForm<IPageFormState>({
    defaultValues: initialFormState,
    resolver: zodResolver(SettingSchema.putECommerce),
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
        t,
        sessionAuth,
        minPermission: ECommerceEndPointPermission.SETTINGS,
        showToast,
      })
    ) {
      setPageTitle();
      getCurrencyTypes();
      await getSettings();
      setIsPageLoaded(true);
    }
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('eCommerce'),
        },
        {
          title: t('settings'),
        },
      ])
    );
  };

  const getSettings = async () => {
    const serviceResult = await SettingService.get(
      { projection: SettingProjectionKeys.ECommerce },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const setting = serviceResult.data;
      if (setting.eCommerce) {
        dispatch({ type: ActionTypes.SET_ITEM, payload: setting.eCommerce });
      }
    }
  };

  const getCurrencyTypes = () => {
    dispatch({
      type: ActionTypes.SET_CURRENCY_TYPES,
      payload: currencyTypes.map((currency) => ({
        label: `${currency.title} (${currency.icon})`,
        value: currency.id.toString(),
      })),
    });
  };

  const onSubmit = async (data: IPageFormState) => {
    const params = data;
    const serviceResult = await SettingService.updateECommerce(
      params,
      abortControllerRef.current.signal
    );

    if (serviceResult.status) {
      appDispatch(setCurrencyIdState(params.eCommerce.currencyId));
      showToast({
        type: 'success',
        title: t('successful'),
        content: t('settingsUpdated'),
      });
    }
  };

  const formValues = form.getValues();

  return isPageLoading ? null : (
    <div className="page-post">
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
                        <ComponentPageECommerceSettingsTabGeneral
                          currencyTypes={state.currencyTypes}
                          currencyId={formValues.eCommerce.currencyId}
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
