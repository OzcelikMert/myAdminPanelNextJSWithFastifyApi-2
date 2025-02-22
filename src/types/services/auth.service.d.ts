import { UserRoleId } from '@constants/userRoles';

export interface ISessionAuthUserResultService {
  userId: string;
  roleId: UserRoleId;
  username: string;
  email: string;
  name: string;
  url: string;
  image: string;
  ip: string;
  permissions: number[];
  createdAt?: Date;
  updatedAt?: Date;
  refreshedAt?: Date;
}

export type IAuthLoginResultService = {
  tokenId?: string;
  statusId?: StatusId;
  banDateEnd?: Date;
  banComment?: string;
} & ISessionAuthUserResultService;

export interface ISessionAuthResultService {
  _id?: string;
  user: ISessionAuthUserResultService;
}

export interface IAuthLoginParamService {
  username: string;
  password: string;
}
