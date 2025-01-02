import { IPanelLanguage } from 'types/constants/panelLanguages';

export enum PanelLanguageId {
  Turkish = 1,
  English,
}

export enum PanelLanguageCodes {
  Turkish = "tr-tr",
  EnglishUS = "en-us",
}

export const panelLanguages: Array<IPanelLanguage> = [
  {
    id: PanelLanguageId.English,
    code: PanelLanguageCodes.EnglishUS,
    title: 'English',
    rank: 1,
    image: 'us.webp',
  },
  {
    id: PanelLanguageId.Turkish,
    code: PanelLanguageCodes.Turkish,
    title: 'Türkçe',
    rank: 2,
    image: 'tr.webp',
  },
];
