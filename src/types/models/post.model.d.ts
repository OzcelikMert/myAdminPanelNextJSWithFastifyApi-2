import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import { PageTypeId } from '@constants/pageTypes';
import { ProductTypeId } from '@constants/productTypes';
import { AttributeTypeId } from '@constants/attributeTypes';

export interface IPostModel {
  _id: string;
  typeId: PostTypeId;
  statusId: StatusId;
  pageTypeId?: PageTypeId;
  authorId: string;
  lastAuthorId: string;
  authors?: string[];
  dateStart?: string;
  rank: number;
  isFixed?: boolean;
  categories?: string[];
  tags?: string[];
  contents: IPostContentModel;
  beforeAndAfter?: IPostBeforeAndAfterModel;
  eCommerce?: IPostECommerceModel;
  components?: string[];
  similarItems?: string[];
  isNoIndex?: boolean;
  updatedAt?: string;
  createdAt?: string;
}

export interface IPostContentModel {
  _id?: string;
  langId: string;
  image?: string;
  icon?: string;
  title: string;
  content?: string;
  shortContent?: string;
  url?: string;
  views?: number;
  buttons?: IPostContentButtonModel[];
}

export interface IPostBeforeAndAfterModel {
  imageBefore: string;
  imageAfter: string;
  images: string[];
}

export interface IPostContentButtonModel {
  _id: string;
  title: string;
  url?: string;
}

export interface IPostECommerceModel {
  typeId: ProductTypeId;
  images: string[];
  pricing?: IPostECommercePricingModel;
  inventory?: IPostECommerceInventoryModel;
  shipping?: IPostECommerceShippingModel;
  attributes?: IPostECommerceAttributeModel[];
  variations?: IPostECommerceVariationModel[];
  defaultVariationOptions?: IPostECommerceVariationOptionModel[];
}

export interface IPostECommercePricingModel {
  taxRate: number;
  taxExcluded: number;
  taxIncluded: number;
  compared: number;
  shipping: number;
}

export interface IPostECommerceInventoryModel {
  sku: string;
  isManageStock: boolean;
  quantity: number;
}

export interface IPostECommerceShippingModel {
  width: string;
  height: string;
  depth: string;
  weight: string;
}

export interface IPostECommerceAttributeModel {
  _id: string;
  attributeTermId: string;
  variationTerms: string[];
  typeId: AttributeTypeId;
}

export interface IPostECommerceVariationModel {
  _id: string;
  options: IPostECommerceVariationOptionModel[];
  productId: IPostECommerceVariationItemModel;
}

export interface IPostECommerceVariationOptionModel {
  _id: string;
  attributeId: string;
  variationTermId: string;
}
