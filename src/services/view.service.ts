import { ApiEndPoints } from '@constants/apiEndPoints';
import {
  IViewGetStatisticsResultService,
  IViewGetNumberResultService,
  IViewAddParamService,
} from 'types/services/view.service';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { IViewModel } from 'types/models/view.model';

const getNumber = (signal?: any) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.VIEW_WITH.GET_NUMBER,
    signal: signal,
  }).get<IViewGetNumberResultService>();
};

const getStatistics = (signal?: any) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.VIEW_WITH.GET_STATISTICS,
    signal: signal,
  }).get<IViewGetStatisticsResultService>();
};

const webSocketOnlineUsers = (onMessage?: (msg: MessageEvent<any>) => void) =>  {
  const ws = new WebSocket(PathUtil.getApiURL(true) + ApiEndPoints.VIEW_WITH.WEBSOCKET_ONLINE_USERS);
  console.log(PathUtil.getApiURL(true) + ApiEndPoints.VIEW_WITH.WEBSOCKET_ONLINE_USERS, ws);
  if(onMessage){
    ws.onmessage = onMessage;
  }
  return ws;
}

export const ViewService = {
  getNumber: getNumber,
  getStatistics: getStatistics,
  webSocketOnlineUsers
};
