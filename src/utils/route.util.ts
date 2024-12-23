import { setIsPageLoadingState } from '@lib/features/pageSlice';
import { setIsSessionAuthCheckedState } from '@lib/features/sessionSlice';
import { set } from 'lodash';
import { IRouteChangeParamUtil } from 'types/utils/route.util';

const change = async (params: IRouteChangeParamUtil) => {
  if (params.router.asPath != params.path) {
    params.dispatch(setIsPageLoadingState(true));
    params.dispatch(setIsSessionAuthCheckedState(false));
  }

  return await params.router.push(params.path, params.as ?? params.path, {
    shallow: true,
  });
};

export const RouteUtil = {
  change: change,
};
