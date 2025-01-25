import { BlogsWebsiteEndPoint } from "./blogs.website.endPoint";
import { SitemapsWebsiteEndPoint } from "./sitemaps.website.endPoint";

export class WebsiteEndPoints {
  static get HOME() {
    return '/';
  }

  static PAGE(url?: string) {
    return `/${url ?? ':url'}`;
  }

  static BLOG(url?: string) {
    return `/${url ?? ':url'}`;
  }

  static get BLOGS() {
    return '/blogs';
  }
  static get BLOGS_WITH() {
    return new BlogsWebsiteEndPoint();
  }

  static get SITEMAP() {
    return '/sitemap.xml';
  }

  static get SITEMAPS() {
    return '/sitemaps';
  }
  static get SITEMAPS_WITH() {
    return new SitemapsWebsiteEndPoint();
  }
}
