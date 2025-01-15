import { IPanelLanguageKeys } from './panelLanguageKeys';
import { PostTypeId } from '@constants/postTypes';

export interface IPostType {
  id: PostTypeId;
  rank: number;
  langKey: IPanelLanguageKeys;
}
