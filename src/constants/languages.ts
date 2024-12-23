import { ILanguage } from 'types/constants/languages';

export enum LanguageId {
  Turkish = 1,
  English,
}

export enum LanguageCodes {
  Turkish = "tr-tr",
  EnglishUS = "en-us",
}

export const languages: Array<ILanguage> = [
  {
    id: LanguageId.English,
    code: LanguageCodes.EnglishUS,
    title: 'English',
    rank: 1,
    image: 'us.webp',
  },
  {
    id: LanguageId.Turkish,
    code: LanguageCodes.Turkish,
    title: 'Türkçe',
    rank: 2,
    image: 'tr.webp',
  },
];
