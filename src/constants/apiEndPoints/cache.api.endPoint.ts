import { ApiEndPoints } from '@constants/apiEndPoints/index';
import { PathUtil } from '@utils/path.util';

export class CacheApiEndPoint {
  private mainPath: string;

  constructor(mainPath = ApiEndPoints.CACHE) {
    this.mainPath = mainPath;
  }

  get DELETE_ALL() {
    return PathUtil.createPath(this.mainPath, '/delete/all');
  }
}
