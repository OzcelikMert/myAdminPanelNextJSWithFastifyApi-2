import { boolean, object, string, z } from 'zod';

const postSchema = object({
  email: string().min(1).email(),
  password: string().min(1),
  keepMe: boolean().optional(),
});

const postLockSchema = object({
  password: string().min(1),
});

export type IAuthPostSchema = z.infer<typeof postSchema>;

export const AuthSchema = {
  post: postSchema,
  postLock: postLockSchema,
};
