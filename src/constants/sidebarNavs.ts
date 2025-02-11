import { PostTypeId } from './postTypes';
import { ISidebarPath } from 'types/constants/sidebarNavs';
import { EndPoints } from '@constants/endPoints';
import { NavigationEndPointPermission } from '@constants/endPointPermissions/navigation.endPoint.permission';
import { PostEndPointPermission } from '@constants/endPointPermissions/post.endPoint.permission';
import { ThemeContentEndPointPermission } from '@constants/endPointPermissions/themeContent.endPoint.permission';
import { ECommerceEndPointPermission } from '@constants/endPointPermissions/eCommerce.endPoint.permission';
import { UserEndPointPermission } from '@constants/endPointPermissions/user.endPoint.permission';
import { SubscriberEndPointPermission } from '@constants/endPointPermissions/subscriber.endPoint.permission';
import { LanguageEndPointPermission } from '@constants/endPointPermissions/language.endPoint.permission';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { ComponentEndPointPermission } from '@constants/endPointPermissions/component.endPoint.permission';

export const sidebarNavs: ISidebarPath[] = [
  {
    id: 'dashboard',
    path: EndPoints.DASHBOARD,
    icon: `home`,
    title: 'dashboard',
  },
  {
    id: 'gallery',
    path: EndPoints.GALLERY,
    icon: `image-multiple`,
    title: 'gallery',
    state: `gallery`,
    subPaths: [
      {
        id: 'galleryUpload',
        path: EndPoints.GALLERY_WITH.UPLOAD,
        icon: `upload`,
        title: 'upload',
      },
      { id: 'galleryList', path: EndPoints.GALLERY_WITH.LIST, title: 'list' },
    ],
  },
  {
    id: 'pages',
    path: EndPoints.POST(PostTypeId.Page),
    icon: `note-multiple`,
    title: 'pages',
    state: `pages`,
    permission: PostEndPointPermission.GET_PAGE,
    subPaths: [
      {
        id: 'pageAdd',
        path: EndPoints.POST_WITH(PostTypeId.Page).ADD,
        title: 'add',
        permission: PostEndPointPermission.ADD_PAGE,
      },
      {
        id: 'pageList',
        path: EndPoints.POST_WITH(PostTypeId.Page).LIST,
        title: 'list',
      },
    ],
  },
  {
    id: 'navigations',
    path: EndPoints.NAVIGATION,
    icon: `navigation-variant`,
    title: 'navigations',
    state: `navigates`,
    permission: NavigationEndPointPermission.GET,
    subPaths: [
      {
        id: 'navigationAdd',
        path: EndPoints.NAVIGATION_WITH.ADD,
        title: 'add',
        permission: NavigationEndPointPermission.ADD,
      },
      {
        id: 'navigationList',
        path: EndPoints.NAVIGATION_WITH.LIST,
        title: 'list',
      },
    ],
  },
  {
    id: 'components',
    path: EndPoints.COMPONENT,
    icon: `shape`,
    title: 'components',
    state: `components`,
    permission: ComponentEndPointPermission.GET,
    subPaths: [
      {
        id: 'componentAdd',
        path: EndPoints.COMPONENT_WITH.ADD,
        title: 'add',
        permission: ComponentEndPointPermission.ADD,
      },
      {
        id: 'componentList',
        path: EndPoints.COMPONENT_WITH.LIST,
        title: 'list',
      },
    ],
  },
  {
    id: 'themeContents',
    path: EndPoints.THEME_CONTENT,
    icon: `collage`,
    title: 'themeContents',
    state: `themeContents`,
    permission: ThemeContentEndPointPermission.GET,
    subPaths: [
      {
        id: 'blogs',
        path: EndPoints.THEME_CONTENT_WITH.BLOG,
        title: 'blogs',
        state: `blogs`,
        permission: PostEndPointPermission.GET_BLOG,
        subPaths: [
          {
            id: 'blogAdd',
            path: EndPoints.THEME_CONTENT_WITH.BLOG_WITH.ADD,
            title: 'add',
            permission: PostEndPointPermission.ADD_BLOG,
          },
          {
            id: 'blogList',
            path: EndPoints.THEME_CONTENT_WITH.BLOG_WITH.LIST,
            title: 'list',
          },
        ],
      },
      {
        id: 'portfolios',
        path: EndPoints.THEME_CONTENT_WITH.PORTFOLIO,
        title: 'portfolios',
        state: `portfolios`,
        permission: PostEndPointPermission.GET_PORTFOLIO,
        subPaths: [
          {
            id: 'portfolioAdd',
            path: EndPoints.THEME_CONTENT_WITH.PORTFOLIO_WITH.ADD,
            title: 'add',
            permission: PostEndPointPermission.ADD_PORTFOLIO,
          },
          {
            id: 'portfolioList',
            path: EndPoints.THEME_CONTENT_WITH.PORTFOLIO_WITH.LIST,
            title: 'list',
          },
        ],
      },
      {
        id: 'sliders',
        path: EndPoints.THEME_CONTENT_WITH.SLIDER,
        title: 'sliders',
        state: `sliders`,
        permission: PostEndPointPermission.GET_SLIDER,
        subPaths: [
          {
            id: 'sliderAdd',
            path: EndPoints.THEME_CONTENT_WITH.SLIDER_WITH.ADD,
            title: 'add',
            permission: PostEndPointPermission.ADD_SLIDER,
          },
          {
            id: 'sliderList',
            path: EndPoints.THEME_CONTENT_WITH.SLIDER_WITH.LIST,
            title: 'list',
          },
        ],
      },
      {
        id: 'references',
        path: EndPoints.THEME_CONTENT_WITH.REFERENCE,
        title: 'references',
        state: `references`,
        permission: PostEndPointPermission.GET_REFERENCE,
        subPaths: [
          {
            id: 'referenceAdd',
            path: EndPoints.THEME_CONTENT_WITH.REFERENCE_WITH.ADD,
            title: 'add',
            permission: PostEndPointPermission.ADD_REFERENCE,
          },
          {
            id: 'referenceList',
            path: EndPoints.THEME_CONTENT_WITH.REFERENCE_WITH.LIST,
            title: 'list',
          },
        ],
      },
      {
        id: 'services',
        path: EndPoints.THEME_CONTENT_WITH.SERVICE,
        title: 'services',
        state: `services`,
        permission: PostEndPointPermission.GET_SERVICE,
        subPaths: [
          {
            id: 'serviceAdd',
            path: EndPoints.THEME_CONTENT_WITH.SERVICE_WITH.ADD,
            title: 'add',
            permission: PostEndPointPermission.ADD_SERVICE,
          },
          {
            id: 'serviceList',
            path: EndPoints.THEME_CONTENT_WITH.SERVICE_WITH.LIST,
            title: 'list',
          },
        ],
      },
      {
        id: 'testimonials',
        path: EndPoints.THEME_CONTENT_WITH.TESTIMONIAL,
        title: 'testimonials',
        state: `testimonials`,
        permission: PostEndPointPermission.GET_TESTIMONIAL,
        subPaths: [
          {
            id: 'testimonialAdd',
            path: EndPoints.THEME_CONTENT_WITH.TESTIMONIAL_WITH.ADD,
            title: 'add',
            permission: PostEndPointPermission.ADD_TESTIMONIAL,
          },
          {
            id: 'testimonialList',
            path: EndPoints.THEME_CONTENT_WITH.TESTIMONIAL_WITH.LIST,
            title: 'list',
          },
        ],
      },
      {
        id: 'beforeAndAfter',
        path: EndPoints.THEME_CONTENT_WITH.BEFORE_AND_AFTER,
        title: 'beforeAndAfter',
        state: `beforeAndAfter`,
        permission: PostEndPointPermission.GET_BEFORE_AND_AFTER,
        subPaths: [
          {
            id: 'beforeAndAfterAdd',
            path: EndPoints.THEME_CONTENT_WITH.BEFORE_AND_AFTER_WITH.ADD,
            title: 'add',
            permission: PostEndPointPermission.ADD_BEFORE_AND_AFTER,
          },
          {
            id: 'beforeAndAfterList',
            path: EndPoints.THEME_CONTENT_WITH.BEFORE_AND_AFTER_WITH.LIST,
            title: 'list',
          },
        ],
      },
    ],
  },
  {
    id: 'eCommerce',
    path: EndPoints.ECOMMERCE,
    icon: `shopping`,
    title: 'eCommerce',
    state: `eCommerce`,
    permission: ECommerceEndPointPermission.GET,
    subPaths: [
      {
        id: 'eCommerceProduct',
        path: EndPoints.ECOMMERCE_WITH.PRODUCT,
        title: 'product',
        state: `product`,
        permission: PostEndPointPermission.GET_PRODUCT,
        subPaths: [
          {
            id: 'productAdd',
            path: EndPoints.ECOMMERCE_WITH.PRODUCT_WITH.ADD,
            title: 'add',
            permission: PostEndPointPermission.ADD_PRODUCT,
          },
          {
            id: 'productList',
            path: EndPoints.ECOMMERCE_WITH.PRODUCT_WITH.LIST,
            title: 'list',
          },
        ],
      },
      {
        id: 'eCommerceSettings',
        path: EndPoints.ECOMMERCE_WITH.SETTINGS,
        title: 'settings',
        permission: ECommerceEndPointPermission.SETTINGS,
      },
    ],
  },
  {
    id: 'users',
    path: EndPoints.USER,
    icon: `account-multiple`,
    title: 'users',
    state: `users`,
    permission: UserEndPointPermission.GET,
    subPaths: [
      {
        id: 'userAdd',
        path: EndPoints.USER_WITH.ADD,
        title: 'add',
        permission: UserEndPointPermission.ADD,
      },
      { id: 'userList', path: EndPoints.USER_WITH.LIST, title: 'list' },
    ],
  },
  {
    id: 'subscribers',
    path: EndPoints.SUBSCRIBER,
    title: 'subscribers',
    icon: 'account-group',
    permission: SubscriberEndPointPermission.GET,
  },
  {
    id: 'languages',
    path: EndPoints.LANGUAGE,
    icon: `translate`,
    title: 'languages',
    state: `languages`,
    permission: LanguageEndPointPermission.GET,
    subPaths: [
      {
        id: 'languageAdd',
        path: EndPoints.LANGUAGE_WITH.ADD,
        title: 'add',
        permission: LanguageEndPointPermission.GET,
      },
      {
        id: 'languageList',
        path: EndPoints.LANGUAGE_WITH.LIST,
        title: 'list',
        permission: LanguageEndPointPermission.GET,
      },
    ],
  },
  {
    id: 'settings',
    path: EndPoints.SETTINGS,
    icon: `cog`,
    title: 'settings',
    state: `settings`,
    permission: SettingsEndPointPermission.GET,
    subPaths: [
      {
        id: 'settingGeneral',
        path: EndPoints.SETTINGS_WITH.GENERAL,
        title: 'general',
        permission: SettingsEndPointPermission.UPDATE_GENERAL,
      },
      {
        id: 'settingSEO',
        path: EndPoints.SETTINGS_WITH.SEO,
        icon: `tag-search`,
        title: 'seo',
        permission: SettingsEndPointPermission.UPDATE_SEO,
      },
      {
        id: 'settingPaths',
        path: EndPoints.SETTINGS_WITH.PATHS,
        icon: `sign-direction`,
        title: 'paths',
        permission: SettingsEndPointPermission.UPDATE_PATH,
      },
      {
        id: 'settingContactForms',
        path: EndPoints.SETTINGS_WITH.CONTACT_FORMS,
        title: 'contactForms',
        permission: SettingsEndPointPermission.UPDATE_CONTACT_FORM,
      },
      {
        id: 'settingSocialMedia',
        path: EndPoints.SETTINGS_WITH.SOCIAL_MEDIA,
        title: 'socialMedia',
        permission: SettingsEndPointPermission.UPDATE_SOCIAL_MEDIA,
      },
    ],
  },
];
