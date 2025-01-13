import { ApiEndPoints } from '@constants/apiEndPoints';
import { ILanguageGetResultService } from 'types/services/language.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { ILanguageModel } from 'types/models/language.model';
import {
  ILanguageGetManySchema,
  ILanguageGetWithIdSchema,
  ILanguagePostSchema,
  ILanguagePutRankWithIdSchema,
  ILanguagePutWithIdSchema,
} from 'schemas/language.schema';

const getWithId = (params: ILanguageGetWithIdSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.GET_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).get<ILanguageGetResultService>();
};

const getMany = (params: ILanguageGetManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.GET,
    data: params,
    signal: signal,
  }).get<ILanguageGetResultService[]>();
};

const getFlags = (params: {}, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.GET_FLAGS,
    data: params,
    signal: signal,
  }).get<string[]>();
};

const add = (params: ILanguagePostSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.ADD,
    data: params,
    signal: signal,
  }).post<ILanguageModel>();
};

const updateWithId = (
  params: ILanguagePutWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.UPDATE_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateRankWithId = (
  params: ILanguagePutRankWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.LANGUAGE_WITH.UPDATE_RANK_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

export const LanguageService = {
  getWithId: getWithId,
  getMany: getMany,
  getFlags: getFlags,
  add: add,
  updateWithId: updateWithId,
  updateRankWithId: updateRankWithId,
};
