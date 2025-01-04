import { IRouteChangeParamUtil } from 'types/utils/route.util';

const change = async (params: IRouteChangeParamUtil) => {
  return params.router.push(params.path, params.as ?? params.path, {
    shallow: true,
  });
};

export const RouteUtil = {
  change: change,
};
