import { UserRoleId } from '@constants/userRoles';

export interface ISessionAuthUserResultService {
  userId: string;
  roleId: UserRoleId;
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

export interface ISessionAuthResultService {
  _id?: string;
  user: ISessionAuthUserResultService;
}

export interface IAuthLoginParamService {
  email: string;
  password: string;
}
