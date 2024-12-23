import { useEffect } from 'react';
import { LanguageService } from '@services/language.service';
import { SettingService } from '@services/setting.service';
import { StatusId } from '@constants/status';
import { CurrencyId } from '@constants/currencyTypes';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { setCurrencyIdState, setLanguagesState, setMainLangIdState } from '@lib/features/settingSlice';
import { setCurrentLangIdState } from '@lib/features/pageSlice';
import { setIsAppLoadingState } from '@lib/features/appSlice';
import { LanguageCodes, languages } from '@constants/languages';
import { fetchTranslationState } from '@lib/features/translationSlice';
import { LocalStorageUtil } from '@utils/localStorage.util';


type IComponentProps = {
  children: React.ReactNode;
};

export default function ComponentProviderAppInit(  { children } : IComponentProps ) {
  const dispatch = useAppDispatch();
  const isAppLoading = useAppSelector((state) => state.appState.isLoading);

  const fetchLanguages = async () => {
    const serviceResult = await LanguageService.getMany({
      statusId: StatusId.Active,
    });
    if (serviceResult.status && serviceResult.data) {
      let foundDefaultLanguage = serviceResult.data.findSingle(
        'isDefault',
        true
      );
      if (!foundDefaultLanguage) {
        foundDefaultLanguage = serviceResult.data[0];
      }
      dispatch(setLanguagesState(serviceResult.data));
      dispatch(setMainLangIdState(foundDefaultLanguage._id));
      dispatch(setCurrentLangIdState(foundDefaultLanguage._id));
    }
  }

  const fetchSettingECommerce = async () => {
    const serviceResult = await SettingService.get({
      projection: SettingProjectionKeys.ECommerce,
    });
    if (serviceResult.status && serviceResult.data) {
      dispatch(setCurrencyIdState(serviceResult.data.eCommerce?.currencyId || CurrencyId.TurkishLira));
    }
  }

  const dispatchPanelLanguage = async () => {
    let panelLanguage = languages.findSingle("id", LocalStorageUtil.getLanguageId());
    await dispatch(fetchTranslationState(panelLanguage ? panelLanguage.code : LanguageCodes.EnglishUS));
  }

  const init = async () => {
    await fetchLanguages();
    await fetchSettingECommerce();
    await dispatchPanelLanguage();
    dispatch(setIsAppLoadingState(false));
  };

  useEffect(() => {
    init();
  }, []);

  if (isAppLoading) {
    return null;
  }

  return children;
}