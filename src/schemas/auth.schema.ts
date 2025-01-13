import { boolean, object, string, z } from 'zod';

const postSchema = object({
  email: string().min(1, "inputIsRequired").email("fillCorrectly"),
  password: string().min(1, "inputIsRequired"),
  keepMe: boolean()
});

export type IAuthPostSchema = z.infer<typeof postSchema>;

export const AuthSchema = {
  post: postSchema,
};
