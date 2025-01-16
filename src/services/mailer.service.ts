import { ApiEndPoints } from '@constants/apiEndPoints';
import { ApiRequest } from '@library/api/request';
import { PathUtil } from '@utils/path.util';
import { IMailerSendParamService } from 'types/services/mailer.service';

const send = (params: IMailerSendParamService, signal?: AbortSignal) => {
  return new ApiRequest({
    apiUrl: PathUtil.getApiURL(),
    endPoint: ApiEndPoints.MAILER_WITH.SEND,
    data: params,
    signal: signal,
  }).post<{ _id: string; response: string }>();
};

export const MailerService = {
  send: send,
};
