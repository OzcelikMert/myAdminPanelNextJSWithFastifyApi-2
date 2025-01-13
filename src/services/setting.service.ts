import { ApiEndPoints } from '@constants/apiEndPoints';
import { ISettingGetResultService } from 'types/services/setting.service';
import { PathUtil } from '@utils/path.util';
import { ApiRequest } from '@library/api/request';
import {
  ISettingGetSchema,
  ISettingPutContactFormSchema,
  ISettingPutECommerceSchema,
  ISettingPutGeneralSchema,
  ISettingPutPathSchema,
  ISettingPutSEOSchema,
  ISettingPutSocialMediaSchema,
} from 'schemas/setting.schema';

const get = (params: ISettingGetSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SETTING_WITH.GET,
    data: params,
    signal: signal,
  }).get<ISettingGetResultService>();
};

const updateGeneral = (
  params: ISettingPutGeneralSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SETTING_WITH.UPDATE_GENERAL,
    data: params,
    signal: signal,
  }).put();
};

const updateSeo = (params: ISettingPutSEOSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SETTING_WITH.UPDATE_SEO,
    data: params,
    signal: signal,
  }).put();
};

const updateContactForm = (
  params: ISettingPutContactFormSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SETTING_WITH.UPDATE_CONTACT_FORM,
    data: params,
    signal: signal,
  }).put();
};

const updateSocialMedia = (
  params: ISettingPutSocialMediaSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SETTING_WITH.UPDATE_SOCIAL_MEDIA,
    data: params,
    signal: signal,
  }).put();
};

const updateECommerce = (
  params: ISettingPutECommerceSchema,
  signal?: AbortSignal
) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SETTING_WITH.UPDATE_ECOMMERCE,
    data: params,
    signal: signal,
  }).put();
};

const updatePath = (params: ISettingPutPathSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.SETTING_WITH.UPDATE_PATH,
    data: params,
    signal: signal,
  }).put();
};

export const SettingService = {
  get: get,
  updateGeneral: updateGeneral,
  updateSeo: updateSeo,
  updateContactForm: updateContactForm,
  updateSocialMedia: updateSocialMedia,
  updateECommerce: updateECommerce,
  updatePath: updatePath,
};
