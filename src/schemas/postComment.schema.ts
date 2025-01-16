import { object, string, array, z } from 'zod';
import { StatusId } from '@constants/status';
import { PostTypeId } from '@constants/postTypes';

const schema = object({
  parentId: string().optional(),
  postId: string().min(1),
  postTypeId: z.nativeEnum(PostTypeId),
  statusId: z.nativeEnum(StatusId),
  message: string().min(1),
});

const postSchema = schema;

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(schema);

export type IPostCommentPostSchema = z.infer<typeof postSchema>;
export type IPostCommentPutWithIdSchema = z.infer<typeof putWithIdSchema>;

export const PostCommentSchema = {
  post: postSchema,
  putWithId: putWithIdSchema
};
