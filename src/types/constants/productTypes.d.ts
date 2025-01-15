import { IPanelLanguageKeys } from './panelLanguageKeys';
import { ProductTypeId } from '@constants/productTypes';

export interface IProductType {
  id: ProductTypeId;
  rank: number;
  langKey: IPanelLanguageKeys;
}
