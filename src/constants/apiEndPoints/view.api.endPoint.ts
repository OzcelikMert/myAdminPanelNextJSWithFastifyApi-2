import { ApiEndPoints } from '@constants/apiEndPoints/index';
import { PathUtil } from '@utils/path.util';

export class ViewApiEndPoint {
  private mainPath: string;

  constructor(mainPath = ApiEndPoints.VIEW) {
    this.mainPath = mainPath;
  }

  get GET_NUMBER() {
    return PathUtil.createPath(this.mainPath, '/get/number');
  }
  get GET_STATISTICS() {
    return PathUtil.createPath(this.mainPath, '/get/statistics');
  }
  get WEBSOCKET_VISITOR_COUNT() {
    return PathUtil.createPath(this.mainPath, '/ws/visitor-count');
  }
  get WEBSOCKET_ONLINE_USERS() {
    return PathUtil.createPath(this.mainPath, '/ws/online-users');
  }
}
