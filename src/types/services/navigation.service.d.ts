import { IUserPopulateService } from './user.service';
import {
  INavigationContentModel,
  INavigationModel,
} from '../models/navigation.model';
import { StatusId } from '@constants/status';

export interface INavigatePopulateService {
  _id: string;
  contents: INavigationContentModel;
}

export interface INavigationAlternateService {
  langId: string;
}

export type INavigationGetResultService = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
  parent?: INavigationPopulateService;
  contents?: INavigationContentModel;
  alternates?: INavigationAlternateService[];
} & Omit<INavigationModel, 'contents'>;

export interface INavigationGetWithIdParamService {
  _id: string;
  langId?: string;
  statusId?: StatusId;
}

export interface INavigationGetManyParamService {
  _id?: string[];
  langId?: string;
  statusId?: StatusId;
}

export type INavigationAddParamService = {
  isPrimary?: boolean;
  isSecondary?: boolean;
} & Omit<
  INavigationModel,
  '_id' | 'authorId' | 'lastAuthorId' | 'isPrimary' | 'isSecondary'
>;

export type INavigationUpdateWithIdParamService = {
  _id: string;
} & Omit<INavigationAddParamService, 'authorId'>;

export type INavigationUpdateRankWithIdParamService = {
  _id: string;
  rank: number;
};

export type INavigationUpdateStatusManyParamService = {
  _id: string[];
  statusId: StatusId;
};

export interface INavigationDeleteManyParamService {
  _id: string[];
}
