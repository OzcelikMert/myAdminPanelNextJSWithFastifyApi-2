import { ApiEndPoints } from '@constants/apiEndPoints';
import { IUserGetResultService } from 'types/services/user.service';
import { ISessionAuthResultService } from 'types/services/auth.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { IAuthPostSchema } from 'schemas/auth.schema';

const getSession = (signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.AUTH_WITH.GET,
    signal: signal,
  }).get<ISessionAuthResultService>();
};

const login = (params: IAuthPostSchema, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.AUTH_WITH.LOGIN,
    data: params,
    signal: signal,
  }).post<IUserGetResultService>();
};

const logOut = (signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.AUTH_WITH.LOGOUT,
    signal: signal,
  }).delete();
};

export const AuthService = {
  getSession: getSession,
  login: login,
  logOut: logOut,
};
