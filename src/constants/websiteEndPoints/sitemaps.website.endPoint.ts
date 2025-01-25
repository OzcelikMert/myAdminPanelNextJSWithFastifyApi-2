import { WebsiteEndPoints } from '@constants/websiteEndPoints/index';
import { PathUtil } from '@utils/path.util';

export class SitemapsWebsiteEndPoint {
  private mainPath: string;

  constructor(mainPath = WebsiteEndPoints.SITEMAPS) {
    this.mainPath = mainPath;
  }

  POST(typeName?: string, page?: number) {
    return PathUtil.createPath(
      this.mainPath,
      `/post/${typeName ?? ':typeName'}`,
      `/${page ?? ':page'}`
    );
  }
}
