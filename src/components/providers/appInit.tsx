import React from 'react';
import { LanguageService } from '@services/language.service';
import { SettingService } from '@services/setting.service';
import { StatusId } from '@constants/status';
import { CurrencyId } from '@constants/currencyTypes';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import {
  setCurrencyIdState,
  setLanguagesState,
  setMainLangIdState,
} from '@redux/features/settingSlice';
import { setIsAppLoadingState } from '@redux/features/appSlice';
import { PanelLanguageCodes, panelLanguages } from '@constants/panelLanguages';
import { fetchTranslationState } from '@redux/features/translationSlice';
import { LocalStorageUtil } from '@utils/localStorage.util';
import { useDidMount } from '@library/react/hooks';

type IComponentProps = {
  children: React.ReactNode;
};

const ComponentProviderAppInit = (props: IComponentProps) => {
  const abortControllerRef = React.useRef(new AbortController());

  const appDispatch = useAppDispatch();
  const isAppLoading = useAppSelector((state) => state.appState.isLoading);

  useDidMount(() => {
    init();
    return () => {
      abortControllerRef.current.abort();
    };
  });

  const init = async () => {
    await fetchLanguages();
    await fetchSettingECommerce();
    await setPanelLanguage();
    appDispatch(setIsAppLoadingState(false));
  };

  const fetchLanguages = async () => {
    const serviceResult = await LanguageService.getMany(
      {
        statusId: StatusId.Active,
      },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      let foundDefaultLanguage = serviceResult.data.findSingle(
        'isDefault',
        true
      ) ?? serviceResult.data[0];
      appDispatch(setLanguagesState(serviceResult.data));
      appDispatch(setMainLangIdState(foundDefaultLanguage._id));
    }
  };

  const fetchSettingECommerce = async () => {
    const serviceResult = await SettingService.get(
      {
        projection: SettingProjectionKeys.ECommerce,
      },
      abortControllerRef.current.signal
    );
    if (serviceResult.status && serviceResult.data) {
      appDispatch(
        setCurrencyIdState(
          serviceResult.data.eCommerce?.currencyId || CurrencyId.TurkishLira
        )
      );
    }
  };

  const setPanelLanguage = async () => {
    let panelLanguage = panelLanguages.findSingle(
      'id',
      LocalStorageUtil.getLanguageId()
    );
    await appDispatch(
      fetchTranslationState(
        panelLanguage ? panelLanguage.code : PanelLanguageCodes.EnglishUS
      )
    );
  };

  if (isAppLoading) {
    return null;
  }

  return props.children;
};

export default ComponentProviderAppInit;
