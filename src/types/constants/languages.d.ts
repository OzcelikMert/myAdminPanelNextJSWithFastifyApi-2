import { LanguageId, LanguageCodes } from '@constants/languages';

export interface ILanguage {
  id: LanguageId;
  code: LanguageCodes;
  title: string;
  rank: number;
  image: string;
}
