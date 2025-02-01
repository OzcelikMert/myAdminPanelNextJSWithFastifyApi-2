import { IUserPopulateService } from './user.service';
import { IPostTermPopulateService } from './postTerm.service';
import {
  IPostContentModel,
  IPostModel,
  IPostECommerceModel,
  IPostECommerceVariationModel,
  IPostECommerceVariationOptionModel,
} from '../models/post.model';
import { PostTypeId } from '@constants/postTypes';
import { PageTypeId } from '@constants/pageTypes';
import { StatusId } from '@constants/status';
import { PostSortTypeId } from '@constants/postSortTypes';

export interface IPostAlternateService {
  langId: string;
  title?: string;
  url?: string;
}

export type IPostGetResultServiceECommerceVariationOption = {
  variationTerm?: IPostTermPopulateService;
} & IPostECommerceVariationOptionModel;

export type IPostGetResultServiceECommerceVariation = {
  product?: Omit<IPostModel, 'contents'> & {
    alternates?: IPostAlternateService[];
    contents?: IPostContentModel | IPostContentModel[];
    author?: IUserPopulateService;
    lastAuthor?: IUserPopulateService;
  };
  options: IPostGetResultServiceECommerceVariationOption[];
} & Omit<IPostECommerceVariationModel, 'options'>;

export type IPostGetResultServiceECommerceAttribute<T = string> = {
  variationTerms: T[];
  attributeTerm?: IPostTermPopulateService;
} & Omit<IPostECommerceAttributeModel, 'variationTerms'>;

export type IPostGetResultServiceECommerce<T = string> = {
  variations: IPostGetResultServiceECommerceVariation[];
  attributes: IPostGetResultServiceECommerceAttribute<T>[];
} & Omit<IPostECommerceModel, 'variations' | 'attributes'>;

export type IPostGetResultService = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
  authors?: IUserPopulateService[];
  views?: number;
  categories?: IPostTermPopulateService[];
  tags?: IPostTermPopulateService[];
  contents?: IPostContentModel;
  alternates?: IPostAlternateService[];
  eCommerce?: IPostGetResultServiceECommerce<IPostTermPopulateService>;
} & Omit<
  IPostModel,
  'contents' | 'categories' | 'tags' | 'eCommerce' | 'authors'
>;

export type IPostGetManyResultService = {
  eCommerce?: IPostGetResultServiceECommerce;
} & Omit<IPostGetResultService, 'eCommerce'>;

export interface IPostGetWithIdParamService {
  typeId: PostTypeId;
  _id: string;
  pageTypeId?: PageTypeId;
  langId?: string;
  statusId?: StatusId;
}

export interface IPostGetManyParamService {
  _id?: string[];
  sortTypeId?: PostSortTypeId;
  typeId?: PostTypeId[];
  pageTypeId?: PageTypeId[];
  langId?: string;
  statusId?: StatusId;
  count?: number;
  page?: number;
  ignorePostId?: string[];
  title?: string;
  authorId?: string;
  categories?: string[];
  tags?: string[];
}

export interface IPostGetCountParamService {
  typeId: PostTypeId;
  statusId?: StatusId;
  title?: string;
  categories?: string[];
}

export type IPostAddParamService = {} & Omit<
  IPostModel,
  '_id' | 'views' | 'authorId' | 'lastAuthorId'
>;

export type IPostAddProductParamService = {} & Omit<
  IPostModel,
  | '_id'
  | 'views'
  | 'authorId'
  | 'lastAuthorId'
  | 'pageTypeId'
  | 'isNoIndex'
  | 'beforeAndAfter'
  | 'components'
>;

export type IPostUpdateWithIdParamService = {
  _id: string;
} & IPostAddParamService;

export type IPostUpdateProductWithIdParamService = {
  _id: string;
} & IPostAddProductParamService;

export type IPostUpdateRankWithIdParamService = {
  _id: string;
  typeId: PostTypeId;
  rank: number;
};

export type IPostUpdateViewWithIdParamService = {
  _id: string;
  typeId: PostTypeId;
  langId: string;
};

export type IPostUpdateStatusManyParamService = {
  _id: string[];
  typeId: PostTypeId;
  statusId: StatusId;
};

export interface IPostDeleteManyParamService {
  _id: string[];
  typeId: PostTypeId;
}

export interface IPostDeleteProductManyParamService {
  _id: string[];
}
