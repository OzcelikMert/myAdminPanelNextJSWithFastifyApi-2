import { EndPoints } from '@constants/endPoints';
import { IToastReturn } from '@hooks/toast';
import { ITranslationFunc } from '@redux/features/translationSlice';
import { IAppDispatch } from '@redux/store';
import { NextRouter } from 'next/router';
import { IEndPointPermission } from 'types/constants/endPoint.permissions';
import { IPagePropCommon } from 'types/pageProps';
import { ISessionAuthResultService } from 'types/services/auth.service';

export interface IPermissionCheckAndRedirectParamUtil {
  router: NextRouter;
  t: ITranslationFunc;
  sessionAuth: ISessionAuthResultService | null;
  minPermission: IEndPointPermission;
  showToast: IToastReturn['showToast'];
  redirectPath?: string;
}
