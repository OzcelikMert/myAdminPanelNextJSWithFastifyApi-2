import { ApiEndPoints } from '@constants/apiEndPoints';
import { INavigationGetResultService } from 'types/services/navigation.service';
import { PathUtil } from '@utils/path.util';
import { ApiRequest } from '@library/api/request';
import { INavigationModel } from 'types/models/navigation.model';
import {
  INavigationDeleteManySchema,
  INavigationGetManySchema,
  INavigationGetWithIdSchema,
  INavigationPostSchema,
  INavigationPutRankWithIdSchema,
  INavigationPutStatusManySchema,
  INavigationPutWithIdSchema,
} from 'schemas/navigation.schema';

const getWithId = (
  params: INavigationGetWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.GET_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).get<INavigationGetResultService>();
};

const getMany = (params: INavigationGetManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.GET,
    data: params,
    signal: signal,
  }).get<INavigationGetResultService[]>();
};

const add = (params: INavigationPostSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.ADD,
    data: params,
    signal: signal,
  }).post<INavigationModel>();
};

const updateWithId = (
  params: INavigationPutWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.UPDATE_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateRankWithId = (
  params: INavigationPutRankWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.UPDATE_RANK_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateStatusMany = (
  params: INavigationPutStatusManySchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.UPDATE_STATUS,
    data: params,
    signal: signal,
  }).put();
};

const deleteMany = (
  params: INavigationDeleteManySchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.NAVIGATION_WITH.DELETE,
    data: params,
    signal: signal,
  }).delete();
};

export const NavigationService = {
  getWithId: getWithId,
  getMany: getMany,
  add: add,
  updateWithId: updateWithId,
  updateRankWithId: updateRankWithId,
  updateStatusMany: updateStatusMany,
  deleteMany: deleteMany,
};
