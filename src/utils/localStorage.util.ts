import { IThemeKeys } from 'types/constants/themeKeys';

const getLanguageId = () => {
  return Number(window.localStorage.getItem('adminLangId') ?? 1);
};

const setLanguageId = (langId: number) => {
  window.localStorage.setItem('adminLangId', langId.toString());
};

const getTheme = () => {
  return (window.localStorage.getItem('adminTheme') ?? 'default') as IThemeKeys;
};

const setTheme = (theme: IThemeKeys) => {
  window.localStorage.setItem('adminTheme', theme);
};

const getKeepMe = () => {
  return window.localStorage.getItem('adminKeepMe') ?? '';
};

const setKeepMe = (text: string) => {
  window.localStorage.setItem('adminKeepMe', text);
};

export const LocalStorageUtil = {
  getLanguageId: getLanguageId,
  setLanguageId: setLanguageId,
  getTheme: getTheme,
  setTheme: setTheme,
  getKeepMe,
  setKeepMe,
};
