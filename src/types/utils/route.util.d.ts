import { IAppDispatch } from '@lib/store';
import { NextRouter } from 'next/router';
import { IPagePropCommon } from 'types/pageProps';

export interface IRouteChangeParamUtil {
  dispatch: IAppDispatch;
  router: NextRouter;
  path: string;
  as?: string;
}
