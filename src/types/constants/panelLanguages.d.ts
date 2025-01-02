import { LanguageId, LanguageCodes } from '@constants/panelLanguages';

export interface IPanelLanguage {
  id: LanguageId;
  code: LanguageCodes;
  title: string;
  rank: number;
  image: string;
}
