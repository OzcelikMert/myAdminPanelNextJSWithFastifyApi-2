import { ApiEndPoints } from '@constants/apiEndPoints';
import { IPostTermGetResultService } from 'types/services/postTerm.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { IPostTermModel } from 'types/models/postTerm.model';
import {
  IPostTermDeleteManySchema,
  IPostTermGetManySchema,
  IPostTermGetWithIdSchema,
  IPostTermPostSchema,
  IPostTermPutRankWithIdSchema,
  IPostTermPutStatusManySchema,
  IPostTermPutWithIdSchema,
} from 'schemas/postTerm.schema';

const getWithId = (params: IPostTermGetWithIdSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.GET_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).get<IPostTermGetResultService>();
};

const getMany = (params: IPostTermGetManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.GET,
    data: params,
    signal: signal,
  }).get<IPostTermGetResultService[]>();
};

const add = (params: IPostTermPostSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.ADD,
    data: params,
    signal: signal,
  }).post<IPostTermModel>();
};

const updateWithId = (
  params: IPostTermPutWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.UPDATE_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateRankWithId = (
  params: IPostTermPutRankWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.UPDATE_RANK_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateStatusMany = (
  params: IPostTermPutStatusManySchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.UPDATE_STATUS,
    data: params,
    signal: signal,
  }).put();
};

const deleteMany = (
  params: IPostTermDeleteManySchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_TERM_WITH.DELETE,
    data: params,
    signal: signal,
  }).delete();
};

export const PostTermService = {
  getWithId: getWithId,
  getMany: getMany,
  add: add,
  updateWithId: updateWithId,
  updateRankWithId: updateRankWithId,
  updateStatusMany: updateStatusMany,
  deleteMany: deleteMany,
};
