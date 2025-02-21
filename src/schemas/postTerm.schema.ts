import { object, string, array, number, z } from 'zod';
import { StatusId } from '@constants/status';
import { PostTypeId } from '@constants/postTypes';
import { PostTermTypeId } from '@constants/postTermTypes';
import { ZodUtil } from '@utils/zod.util';

const schemaContent = object({
  langId: string().min(1),
  title: string().min(3),
  shortContent: string().optional(),
  image: string().optional(),
  url: string().optional(),
});

const schema = object({
  postTypeId: z.nativeEnum(PostTypeId),
  typeId: z.nativeEnum(PostTermTypeId),
  statusId: z.nativeEnum(StatusId),
  parentId: string().optional(),
  rank: number().default(0),
  contents: schemaContent,
});

const postSchema = schema;

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(schema);

const putStatusManySchema = object({
  postTypeId: z.nativeEnum(PostTypeId),
  typeId: z.nativeEnum(PostTermTypeId),
  statusId: z.nativeEnum(StatusId),
  _id: array(string().min(1)).min(1),
});

export type IPostTermPostSchema = z.infer<typeof postSchema>;
export type IPostTermPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IPostTermPutStatusManySchema = z.infer<typeof putStatusManySchema>;

export const PostTermSchema = {
  post: postSchema,
  putWithId: putWithIdSchema,
  putStatusMany: putStatusManySchema,
};
