import { IUserModel } from '../models/user.model';
import { StatusId } from '@constants/status';
import { UserRoleId } from '@constants/userRoles';
import { PermissionId } from '@constants/permissions';

export interface IUserPopulateService {
  _id: string;
  name: string;
  url: string;
  image: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export type IUserGetResultService = {
  isOnline?: boolean;
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
  username?: string;
} & Omit<IUserModel, 'username'>;

export interface IUserGetWithIdParamService {
  _id: string;
  statusId?: StatusId;
}

export interface IUserGetManyParamService {
  _id?: string[];
  statusId?: StatusId;
  url?: string;
  count?: number;
  page?: number;
  permissions?: PermissionId[];
}

export type IUserAddParamService = {} & Omit<
  IUserModel,
  | '_id'
  | 'authorId'
  | 'lastAuthorId'
  | 'createdAt'
  | 'updatedAt'
  | 'url'
  | 'comment'
  | 'phone'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'image'
>;

export type IUserUpdateWithIdParamService = {
  _id: string;
  password?: string;
} & Omit<IUserAddParamService, 'password'>;

export interface IUserUpdateProfileParamService {
  name: string;
  email: string;
  comment?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface IUserUpdateProfileImageParamService {
  image: string;
}

export interface IUserUpdatePasswordParamService {
  password: string;
  newPassword: string;
}

export type IUserDeleteWithIdParamService = {
  _id: string;
};
