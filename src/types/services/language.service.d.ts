import { ILanguageModel } from '../models/language.model';
import { StatusId } from '@constants/status';
import { IUserPopulateService } from './user.service';

export type ILanguageGetResultService = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
} & ILanguageModel;

export interface ILanguageGetWithIdParamService {
  _id: string;
  shortKey?: string;
  locale?: string;
}

export interface ILanguageGetManyParamService {
  _id?: string[];
  statusId?: StatusId;
}

export type ILanguageAddParamService = {} & Omit<
  ILanguageModel,
  '_id' | 'authorId' | 'lastAuthorId'
>;

export type ILanguageUpdateWithIdParamService = {
  _id: string;
} & ILanguageAddParamService;

export type ILanguageUpdateRankWithIdParamService = {
  _id: string;
  rank: number;
};
