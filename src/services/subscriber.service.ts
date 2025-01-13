import { ApiEndPoints } from '@constants/apiEndPoints';
import { ISubscriberGetResultService } from 'types/services/subscriber.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { ISubscriberModel } from 'types/models/subscriber.model';
import {
  ISubscriberDeleteManySchema,
  ISubscriberDeleteWithIdSchema,
  ISubscriberGetManySchema,
  ISubscriberGetWithIdSchema,
  ISubscriberPostSchema,
} from 'schemas/subscriber.schema';

const getWithId = (
  params: ISubscriberGetWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SUBSCRIBER_WITH.GET_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).get<ISubscriberGetResultService>();
};

const getMany = (params: ISubscriberGetManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SUBSCRIBER_WITH.GET,
    data: params,
    signal: signal,
  }).get<ISubscriberGetResultService[]>();
};

const add = (params: ISubscriberPostSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SUBSCRIBER_WITH.ADD,
    data: params,
    signal: signal,
  }).post<ISubscriberModel>();
};

const deleteWithId = (
  params: ISubscriberDeleteWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SUBSCRIBER_WITH.DELETE_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).delete();
};

const deleteMany = (
  params: ISubscriberDeleteManySchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SUBSCRIBER_WITH.DELETE,
    data: params,
    signal: signal,
  }).delete();
};

export const SubscriberService = {
  getWithId: getWithId,
  getMany: getMany,
  add: add,
  deleteWithId: deleteWithId,
  deleteMany: deleteMany,
};
