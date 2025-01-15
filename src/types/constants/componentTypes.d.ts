import { IPanelLanguageKeys } from './panelLanguageKeys';
import { ComponentTypeId } from '@constants/componentTypes';

export interface IComponentType {
  id: ComponentTypeId;
  langKey: IPanelLanguageKeys;
}
