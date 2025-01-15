import { IPanelLanguageKeys } from './panelLanguageKeys';
import { PostTermTypeId } from '@constants/postTermTypes';

export interface IPostTermType {
  id: PostTermTypeId;
  rank: number;
  langKey: IPanelLanguageKeys;
}
