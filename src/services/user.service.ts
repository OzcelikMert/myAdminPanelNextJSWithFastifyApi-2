import { ApiEndPoints } from '@constants/apiEndPoints';
import { IUserGetResultService } from 'types/services/user.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { IUserModel } from 'types/models/user.model';
import {
  IUserDeleteWithIdSchema,
  IUserGetManySchema,
  IUserGetWithIdSchema,
  IUserPostSchema,
  IUserPutPasswordSchema,
  IUserPutProfileImageSchema,
  IUserPutProfileSchema,
  IUserPutWithIdSchema,
} from 'schemas/user.schema';

const getWithId = (params: IUserGetWithIdSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.GET_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).get<IUserGetResultService>();
};

const getMany = (params: IUserGetManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.GET,
    data: params,
    signal: signal,
  }).get<IUserGetResultService[]>();
};

const add = (params: IUserPostSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.ADD,
    data: params,
    signal: signal,
  }).post<IUserModel>();
};

const updateWithId = (params: IUserPutWithIdSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.UPDATE_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).put();
};

const updateProfile = (params: IUserPutProfileSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.UPDATE_PROFILE,
    data: params,
    signal: signal,
  }).put();
};

const updateProfileImage = (
  params: IUserPutProfileImageSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.UPDATE_PROFILE_IMAGE,
    data: params,
    signal: signal,
  }).put();
};

const updatePassword = (
  params: IUserPutPasswordSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.UPDATE_PASSWORD,
    data: params,
    signal: signal,
  }).put();
};

const deleteWithId = (
  params: IUserDeleteWithIdSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.USER_WITH.DELETE_WITH_ID(params._id),
    data: params,
    signal: signal,
  }).delete();
};

export const UserService = {
  getWithId: getWithId,
  getMany: getMany,
  add: add,
  updateWithId: updateWithId,
  updateProfile: updateProfile,
  updateProfileImage: updateProfileImage,
  updatePassword: updatePassword,
  deleteWithId: deleteWithId,
};
