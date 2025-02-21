import { object, string, array, z } from 'zod';

const postSchema = object({
  email: string().min(1).email(),
});

export type ISubscriberPostSchema = z.infer<typeof postSchema>;

export const SubscriberSchema = {
  post: postSchema,
};
