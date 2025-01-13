import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  IGalleryGetResultService,
  IGalleryImageProperties,
} from 'types/services/gallery.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { IApiRequestParam } from '@library/types/api';
import { IGalleryModel } from 'types/models/gallery.model';
import {
  IGalleryDeleteManySchema,
  IGalleryGetManySchema,
} from 'schemas/gallery.schema';

const get = (params: IGalleryGetManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.GALLERY_WITH.GET_IMAGE,
    data: params,
    signal: signal,
  }).get<IGalleryGetResultService[]>();
};

const add = (
  params: FormData,
  onUploadProgress: IApiRequestParam['onUploadProgress'],
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.GALLERY_WITH.ADD_IMAGE,
    data: params,
    contentType: false,
    processData: false,
    onUploadProgress: onUploadProgress,
    signal: signal,
  }).post<(IGalleryModel & IGalleryImageProperties)[]>();
};

const deleteMany = (params: IGalleryDeleteManySchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.GALLERY_WITH.DELETE_IMAGE,
    data: params,
    signal: signal,
  }).delete();
};

export const GalleryService = {
  get: get,
  add: add,
  deleteMany: deleteMany,
};
