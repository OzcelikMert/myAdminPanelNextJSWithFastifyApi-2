import { SettingService } from '@services/setting.service';
import ComponentToast from '@components/elements/toast';
import { ISettingUpdateECommerceParamService } from 'types/services/setting.service';
import { Tab, Tabs } from 'react-bootstrap';
import { CurrencyId, currencyTypes } from '@constants/currencyTypes';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { PermissionUtil } from '@utils/permission.util';
import { ECommerceEndPointPermission } from '@constants/endPointPermissions/eCommerce.endPoint.permission';
import { ISettingECommerceModel } from 'types/models/setting.model';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { useEffect, useReducer, useState } from 'react';
import { useFormReducer } from '@library/react/handles/form';
import { useRouter } from 'next/router';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import { setBreadCrumbState } from '@redux/features/breadCrumbSlice';
import { setCurrencyIdState } from '@redux/features/settingSlice';
import ComponentForm from '@components/elements/form';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IComponentState = {
  currencyTypes: IThemeFormSelectData[];
  item?: ISettingECommerceModel;
  mainTabActiveKey: string;
};

const initialState: IComponentState = {
  currencyTypes: [],
  mainTabActiveKey: `general`,
};

enum ActionTypes {
  SET_CURRENCY_TYPES,
  SET_ITEM,
  SET_MAIN_TAB_ACTIVE_KEY,
}

type IAction =
  | {
      type: ActionTypes.SET_CURRENCY_TYPES;
      payload: IComponentState['currencyTypes'];
    }
  | { type: ActionTypes.SET_ITEM; payload: IComponentState['item'] }
  | {
      type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IComponentState['mainTabActiveKey'];
    };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
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

type IComponentFormState = ISettingUpdateECommerceParamService;

const initialFormState: IComponentFormState = {
  eCommerce: {
    currencyId: CurrencyId.Dollar,
  },
};

export default function PageECommerceSettings() {
  const abortController = new AbortController();

  const appDispatch = useAppDispatch();
  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { formState, onChangeSelect } =
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
        t,
        sessionAuth,
        minPermission: ECommerceEndPointPermission.SETTINGS,
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
      abortController.signal
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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const serviceResult = await SettingService.updateECommerce(
      formState,
      abortController.signal
    );

    if (serviceResult.status) {
      appDispatch(setCurrencyIdState(formState.eCommerce.currencyId));
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: t('settingsUpdated'),
      });
    }
  };

  const TabGeneral = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('currencyType')}
            isMulti={false}
            name="eCommerce.currencyId"
            isSearchable={false}
            options={state.currencyTypes}
            value={state.currencyTypes.findSingle(
              'value',
              formState.eCommerce.currencyId
            )}
            onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
          />
        </div>
      </div>
    );
  };

  return isPageLoading ? null : (
    <div className="page-post">
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
