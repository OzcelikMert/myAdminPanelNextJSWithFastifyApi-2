import { PageTypeId } from '@constants/pageTypes';
import { IPanelLanguageKeys } from './panelLanguageKeys';

export interface IPageType {
  id: PageTypeId;
  rank: number;
  langKey: IPanelLanguageKeys;
}
