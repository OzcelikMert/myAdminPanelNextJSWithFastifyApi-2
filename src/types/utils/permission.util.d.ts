import { EndPoints } from '@constants/endPoints';
import { ITranslationFunc } from '@lib/features/translationSlice';
import { IAppDispatch } from '@lib/store';
import { NextRouter } from 'next/router';
import { IEndPointPermission } from 'types/constants/endPoint.permissions';
import { IPagePropCommon } from 'types/pageProps';
import { ISessionAuthResultService } from 'types/services/auth.service';

export interface IPermissionCheckAndRedirectParamUtil {
  router: NextRouter,
  appDispatch: IAppDispatch,
  t: ITranslationFunc,
  sessionAuth: ISessionAuthResultService | null,
  minPermission: IEndPointPermission,
  redirectPath?: string
}
