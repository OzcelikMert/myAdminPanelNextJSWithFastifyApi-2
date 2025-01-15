import { IPanelLanguageKeys } from './panelLanguageKeys';
import { ElementTypeId } from '@constants/elementTypes';

export interface IElementType {
  id: ElementTypeId;
  langKey: IPanelLanguageKeys;
}
