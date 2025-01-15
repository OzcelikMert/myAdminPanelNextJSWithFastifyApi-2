import { IPanelLanguageKeys } from './panelLanguageKeys';
import { StatusId } from '@constants/status';

export interface IStatus {
  id: StatusId;
  rank: number;
  langKey: IPanelLanguageKeys;
}
