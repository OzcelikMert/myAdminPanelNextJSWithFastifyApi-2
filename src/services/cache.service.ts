import { ApiEndPoints } from '@constants/apiEndPoints';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';

const deleteAll = (signal?: any) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.CACHE_WITH.DELETE_ALL,
    signal: signal,
  }).delete<boolean>();
};

export const CacheService = {
  deleteAll
};
