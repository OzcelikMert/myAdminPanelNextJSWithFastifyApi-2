import { WebsiteEndPoints } from '@constants/websiteEndPoints/index';
import { PathUtil } from '@utils/path.util';

export class BlogsWebsiteEndPoint {
  private mainPath: string;

  constructor(mainPath = WebsiteEndPoints.BLOGS) {
    this.mainPath = mainPath;
  }

  CATEGORY(categoryURL?: string) {
    return PathUtil.createPath(
      this.mainPath,
      `/category/${categoryURL ?? ':category'}`
    );
  }
  CATEGORY_WITH(categoryURL?: string) {
    return new BlogsWebsiteEndPoint(this.CATEGORY(categoryURL));
  }

  AUTHOR(authorURL?: string) {
    return PathUtil.createPath(
      this.mainPath,
      `/author/${authorURL ?? ':author'}`
    );
  }
  AUTHOR_WITH(authorURL?: string) {
    return new BlogsWebsiteEndPoint(this.AUTHOR(authorURL));
  }

  PAGE(page?: string) {
    return PathUtil.createPath(this.mainPath, `/page/${page ?? ':page'}`);
  }
  PAGE_WITH(page?: string) {
    return new BlogsWebsiteEndPoint(this.PAGE(page));
  }

  SEARCH(search?: string) {
    return PathUtil.createPath(this.mainPath, `/search/${search ?? ':search'}`);
  }
  SEARCH_WITH(search?: string) {
    return new BlogsWebsiteEndPoint(this.SEARCH(search));
  }
}
