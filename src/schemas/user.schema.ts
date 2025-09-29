import { object, string, array, z, ZodIssueCode } from 'zod';
import { UserRoleId } from '@constants/userRoles';
import { StatusId } from '@constants/status';
import { PermissionId } from '@constants/permissions';

const schema = object({
  roleId: z.nativeEnum(UserRoleId),
  statusId: z.nativeEnum(StatusId),
  name: string().min(3),
  username: string()
    .min(2)
    .toLowerCase()
    .regex(/^[a-zA-Z0-9_-]+$/),
  email: string().min(1).email(),
  password: string().min(1),
  permissions: array(z.nativeEnum(PermissionId)).optional().default([]),
  banDateEnd: string().optional(),
  banComment: string().optional(),
});

const postSchema = schema;

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(schema.merge(object({ password: string().optional() })));

const putProfileSchema = object({
  name: string().min(1),
  email: string().min(1).email(),
  comment: string().optional(),
  phone: string().optional(),
  facebook: string().optional(),
  instagram: string().optional(),
  twitter: string().optional(),
});

const putProfileImageSchema = object({
  image: string().min(1),
});

const putPasswordSchema = object({
  password: string().min(1),
  newPassword: string().min(1),
  confirmPassword: string().min(1),
});

export type IUserPostSchema = z.infer<typeof postSchema>;
export type IUserPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IUserPutProfileSchema = z.infer<typeof putProfileSchema>;
export type IUserPutProfileImageSchema = z.infer<typeof putProfileImageSchema>;
export type IUserPutPasswordSchema = z.infer<typeof putPasswordSchema>;

export const UserSchema = {
  post: postSchema,
  putWithId: putWithIdSchema,
  putProfile: putProfileSchema,
  putProfileImage: putProfileImageSchema,
  putPassword: putPasswordSchema,
};
