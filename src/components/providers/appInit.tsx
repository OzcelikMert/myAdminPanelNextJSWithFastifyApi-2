import { useEffect } from 'react';
import { LanguageService } from '@services/language.service';
import { SettingService } from '@services/setting.service';
import { StatusId } from '@constants/status';
import { CurrencyId } from '@constants/currencyTypes';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import {
  setCurrencyIdState,
  setLanguagesState,
  setMainLangIdState,
} from '@lib/features/settingSlice';
import { setIsAppLoadingState } from '@lib/features/appSlice';
import { PanelLanguageCodes, panelLanguages } from '@constants/panelLanguages';
import { fetchTranslationState } from '@lib/features/translationSlice';
import { LocalStorageUtil } from '@utils/localStorage.util';

type IComponentProps = {
  children: React.ReactNode;
};

export default function ComponentProviderAppInit({
  children,
}: IComponentProps) {
  const abortController = new AbortController();

  const appDispatch = useAppDispatch();
  const isAppLoading = useAppSelector((state) => state.appState.isLoading);

  useEffect(() => {
    init();
    return () => {
      abortController.abort();
    };
  }, []);

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
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      let foundDefaultLanguage = serviceResult.data.findSingle(
        'isDefault',
        true
      );
      if (!foundDefaultLanguage) {
        foundDefaultLanguage = serviceResult.data[0];
      }
      appDispatch(setLanguagesState(serviceResult.data));
      appDispatch(setMainLangIdState(foundDefaultLanguage._id));
    }
  };

  const fetchSettingECommerce = async () => {
    const serviceResult = await SettingService.get(
      {
        projection: SettingProjectionKeys.ECommerce,
      },
      abortController.signal
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

  return children;
}
