import { IPanelLanguageKeys } from './panelLanguageKeys';
import { AttributeTypeId } from '@constants/attributeTypes';

export interface IAttributeType {
  id: AttributeTypeId;
  rank: number;
  langKey: IPanelLanguageKeys;
}
