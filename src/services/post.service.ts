import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  IPostGetManyResultService,
  IPostGetResultService,
} from 'types/services/post.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { IPostModel } from 'types/models/post.model';
import {
  IPostDeleteManySchema,
  IPostDeleteProductManySchema,
  IPostGetCountSchema,
  IPostGetManySchema,
  IPostGetWithIdSchema,
  IPostPostProductSchema,
  IPostPostSchema,
  IPostPutProductWithIdSchema,
  IPostPutRankWithIdSchema,
  IPostPutStatusManySchema,
  IPostPutWithIdSchema,
} from 'schemas/post.schema';

const getWithId = (params: IPostGetWithIdSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.GET_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).get<IPostGetResultService>();
};

const getMany = (params: IPostGetManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.GET,
    data: params,
    signal: signal,
  }).get<IPostGetManyResultService[]>();
};

const getCount = (params: IPostGetCountSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.GET_COUNT,
    data: params,
    signal: signal,
  }).get<number>();
};

const add = (params: IPostPostSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.ADD,
    data: params,
    signal: signal,
  }).post<IPostModel>();
};

const addProduct = (params: IPostPostProductSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.ADD_PRODUCT,
    data: params,
    signal: signal,
  }).post<IPostModel>();
};

const updateWithId = (params: IPostPutWithIdSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.UPDATE_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateProductWithId = (
  params: IPostPutProductWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.UPDATE_PRODUCT_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateRankWithId = (
  params: IPostPutRankWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.UPDATE_RANK_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateStatusMany = (
  params: IPostPutStatusManySchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.UPDATE_STATUS,
    data: params,
    signal: signal,
  }).put();
};

const deleteMany = (params: IPostDeleteManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.DELETE,
    data: params,
    signal: signal,
  }).delete();
};

const deleteProductMany = (
  params: IPostDeleteProductManySchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.POST_WITH.DELETE_PRODUCT,
    data: params,
    signal: signal,
  }).delete();
};

export const PostService = {
  getWithId: getWithId,
  getMany: getMany,
  getCount: getCount,
  add: add,
  addProduct: addProduct,
  updateWithId: updateWithId,
  updateProductWithId: updateProductWithId,
  updateRankWithId: updateRankWithId,
  updateStatusMany: updateStatusMany,
  deleteMany: deleteMany,
  deleteProductMany: deleteProductMany,
};
