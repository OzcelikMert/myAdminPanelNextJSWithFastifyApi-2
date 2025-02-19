import { IPermission } from 'types/constants/permissions';
import { PermissionGroupId } from './permissionGroups';
import { UserRoleId } from '@constants/userRoles';

export enum PermissionId {
  BlogAdd = 1,
  BlogEdit,
  BlogDelete,
  PortfolioAdd,
  PortfolioEdit,
  PortfolioDelete,
  SliderAdd,
  SliderEdit,
  SliderDelete,
  ReferenceAdd,
  ReferenceEdit,
  ReferenceDelete,
  UserAdd,
  UserEdit,
  UserDelete,
  PageEdit,
  NavigationAdd,
  NavigationEdit,
  NavigationDelete,
  SEOEdit,
  SettingEdit,
  ServiceAdd,
  ServiceEdit,
  ServiceDelete,
  TestimonialAdd,
  TestimonialEdit,
  TestimonialDelete,
  SubscriberEdit,
  ProductAdd,
  ProductEdit,
  ProductDelete,
  ECommerce,
  BeforeAndAfterAdd,
  BeforeAndAfterEdit,
  BeforeAndAfterDelete,
  ComponentEdit,
}

export const permissions: Array<IPermission> = [
  {
    id: PermissionId.BlogAdd,
    groupId: PermissionGroupId.Blog,
    minUserRoleId: UserRoleId.Author,
    langKey: 'add',
  },
  {
    id: PermissionId.BlogEdit,
    groupId: PermissionGroupId.Blog,
    minUserRoleId: UserRoleId.Author,
    langKey: 'edit',
  },
  {
    id: PermissionId.BlogDelete,
    groupId: PermissionGroupId.Blog,
    minUserRoleId: UserRoleId.Author,
    langKey: 'delete',
  },
  {
    id: PermissionId.PortfolioAdd,
    groupId: PermissionGroupId.Portfolio,
    minUserRoleId: UserRoleId.Author,
    langKey: 'add',
  },
  {
    id: PermissionId.PortfolioEdit,
    groupId: PermissionGroupId.Portfolio,
    minUserRoleId: UserRoleId.Author,
    langKey: 'edit',
  },
  {
    id: PermissionId.PortfolioDelete,
    groupId: PermissionGroupId.Portfolio,
    minUserRoleId: UserRoleId.Author,
    langKey: 'delete',
  },
  {
    id: PermissionId.SliderAdd,
    groupId: PermissionGroupId.Slider,
    minUserRoleId: UserRoleId.Author,
    langKey: 'add',
  },
  {
    id: PermissionId.SliderEdit,
    groupId: PermissionGroupId.Slider,
    minUserRoleId: UserRoleId.Author,
    langKey: 'edit',
  },
  {
    id: PermissionId.SliderDelete,
    groupId: PermissionGroupId.Slider,
    minUserRoleId: UserRoleId.Author,
    langKey: 'delete',
  },
  {
    id: PermissionId.ReferenceAdd,
    groupId: PermissionGroupId.Reference,
    minUserRoleId: UserRoleId.Author,
    langKey: 'add',
  },
  {
    id: PermissionId.ReferenceEdit,
    groupId: PermissionGroupId.Reference,
    minUserRoleId: UserRoleId.Author,
    langKey: 'edit',
  },
  {
    id: PermissionId.ReferenceDelete,
    groupId: PermissionGroupId.Reference,
    minUserRoleId: UserRoleId.Author,
    langKey: 'delete',
  },
  {
    id: PermissionId.ServiceAdd,
    groupId: PermissionGroupId.Service,
    minUserRoleId: UserRoleId.Author,
    langKey: 'add',
  },
  {
    id: PermissionId.ServiceEdit,
    groupId: PermissionGroupId.Service,
    minUserRoleId: UserRoleId.Author,
    langKey: 'edit',
  },
  {
    id: PermissionId.ServiceDelete,
    groupId: PermissionGroupId.Service,
    minUserRoleId: UserRoleId.Author,
    langKey: 'delete',
  },
  {
    id: PermissionId.TestimonialAdd,
    groupId: PermissionGroupId.Testimonial,
    minUserRoleId: UserRoleId.Author,
    langKey: 'add',
  },
  {
    id: PermissionId.TestimonialEdit,
    groupId: PermissionGroupId.Testimonial,
    minUserRoleId: UserRoleId.Author,
    langKey: 'edit',
  },
  {
    id: PermissionId.TestimonialDelete,
    groupId: PermissionGroupId.Testimonial,
    minUserRoleId: UserRoleId.Author,
    langKey: 'delete',
  },
  {
    id: PermissionId.BeforeAndAfterAdd,
    groupId: PermissionGroupId.BeforeAndAfter,
    minUserRoleId: UserRoleId.Author,
    langKey: 'add',
  },
  {
    id: PermissionId.BeforeAndAfterEdit,
    groupId: PermissionGroupId.BeforeAndAfter,
    minUserRoleId: UserRoleId.Author,
    langKey: 'edit',
  },
  {
    id: PermissionId.BeforeAndAfterDelete,
    groupId: PermissionGroupId.BeforeAndAfter,
    minUserRoleId: UserRoleId.Author,
    langKey: 'delete',
  },
  {
    id: PermissionId.UserAdd,
    groupId: PermissionGroupId.User,
    minUserRoleId: UserRoleId.Editor,
    langKey: 'add',
  },
  {
    id: PermissionId.UserEdit,
    groupId: PermissionGroupId.User,
    minUserRoleId: UserRoleId.Editor,
    langKey: 'edit',
  },
  {
    id: PermissionId.UserDelete,
    groupId: PermissionGroupId.User,
    minUserRoleId: UserRoleId.Editor,
    langKey: 'delete',
  },
  {
    id: PermissionId.PageEdit,
    groupId: PermissionGroupId.Page,
    minUserRoleId: UserRoleId.Editor,
    langKey: 'edit',
  },
  {
    id: PermissionId.NavigationAdd,
    groupId: PermissionGroupId.Navigation,
    minUserRoleId: UserRoleId.Editor,
    langKey: 'add',
  },
  {
    id: PermissionId.NavigationEdit,
    groupId: PermissionGroupId.Navigation,
    minUserRoleId: UserRoleId.Editor,
    langKey: 'edit',
  },
  {
    id: PermissionId.NavigationDelete,
    groupId: PermissionGroupId.Navigation,
    minUserRoleId: UserRoleId.Editor,
    langKey: 'delete',
  },
  {
    id: PermissionId.SettingEdit,
    groupId: PermissionGroupId.Settings,
    minUserRoleId: UserRoleId.Admin,
    langKey: 'edit',
  },
  {
    id: PermissionId.SEOEdit,
    groupId: PermissionGroupId.Settings,
    minUserRoleId: UserRoleId.Admin,
    langKey: 'seoEdit',
  },
  {
    id: PermissionId.SubscriberEdit,
    groupId: PermissionGroupId.Subscriber,
    minUserRoleId: UserRoleId.Admin,
    langKey: 'edit',
  },
  {
    id: PermissionId.ECommerce,
    groupId: PermissionGroupId.ECommerce,
    minUserRoleId: UserRoleId.Admin,
    langKey: 'eCommerce',
  },
  {
    id: PermissionId.ProductAdd,
    groupId: PermissionGroupId.Product,
    minUserRoleId: UserRoleId.Author,
    langKey: 'add',
  },
  {
    id: PermissionId.ProductEdit,
    groupId: PermissionGroupId.Product,
    minUserRoleId: UserRoleId.Author,
    langKey: 'edit',
  },
  {
    id: PermissionId.ProductDelete,
    groupId: PermissionGroupId.Product,
    minUserRoleId: UserRoleId.Author,
    langKey: 'delete',
  },
  {
    id: PermissionId.ComponentEdit,
    groupId: PermissionGroupId.Component,
    minUserRoleId: UserRoleId.Editor,
    langKey: 'edit',
  },
];
