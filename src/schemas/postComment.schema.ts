import { object, string, array, z } from 'zod';
import { StatusId } from '@constants/status';
import { PostTypeId } from '@constants/postTypes';
import { ZodUtil } from '@utils/zod.util';

const schema = object({
  parentId: string().optional(),
  postId: string().min(1),
  postTypeId: z.nativeEnum(PostTypeId),
  statusId: z.nativeEnum(StatusId),
  message: string().min(1),
});

const getWithIdSchema = object({
  _id: string().min(1),
  postId: string().optional(),
  postTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
  statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
  authorId: string().optional(),
});

const getManySchema = object({
  _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
  postTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
  statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
  authorId: string().optional(),
});

const postSchema = schema;

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(schema);

const putLikeWithIdSchema = object({
  _id: string().min(1),
  postTypeId: z.nativeEnum(PostTypeId),
  postId: string().min(1),
});

const putStatusManySchema = object({
  postTypeId: z.nativeEnum(PostTypeId),
  statusId: z.nativeEnum(StatusId),
  postId: string().min(1),
  _id: array(string().min(1)).min(1),
});

const deleteManySchema = object({
  postTypeId: z.nativeEnum(PostTypeId),
  postId: string().min(1),
  _id: array(string().min(1)).min(1),
});

export type IPostCommentGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IPostCommentGetManySchema = z.infer<typeof getManySchema>;
export type IPostCommentPostSchema = z.infer<typeof postSchema>;
export type IPostCommentPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IPostCommentPutLikeWithIdSchema = z.infer<
  typeof putLikeWithIdSchema
>;
export type IPostCommentPutStatusManySchema = z.infer<
  typeof putStatusManySchema
>;
export type IPostCommentDeleteManySchema = z.infer<typeof deleteManySchema>;

export const PostCommentSchema = {
  getWithId: getWithIdSchema,
  getMany: getManySchema,
  post: postSchema,
  putWithId: putWithIdSchema,
  putLikeWithId: putLikeWithIdSchema,
  putStatusMany: putStatusManySchema,
  deleteMany: deleteManySchema,
};
