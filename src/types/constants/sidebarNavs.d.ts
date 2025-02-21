import { IPanelLanguageKeys } from 'types/constants/panelLanguageKeys';
import { IEndPointPermission } from 'types/constants/endPoint.permissions';

export interface ISidebarPath {
  id: string;
  path: string;
  maskPath?: string;
  title: IPanelLanguageKeys;
  icon?: string;
  state?: string;
  subPaths?: ISidebarPath[];
  permission?: IEndPointPermission;
}
