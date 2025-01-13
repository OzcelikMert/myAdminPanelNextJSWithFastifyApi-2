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

const getWithIdSchema = object({
  _id: string().min(1),
  postTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
  typeId: ZodUtil.convertToNumber(z.nativeEnum(PostTermTypeId)),
  statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
  langId: string().optional(),
});

const getManySchema = object({
  _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
  typeId: ZodUtil.convertToArray(
    array(ZodUtil.convertToNumber(z.nativeEnum(PostTermTypeId)))
  ).optional(),
  postTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
  statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
  withPostCount: z.coerce.boolean().optional(),
  langId: string().optional(),
  title: string().optional(),
  count: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

const getWithURLSchema = object({
  url: string().min(1),
  postTypeId: ZodUtil.convertToNumber(z.nativeEnum(PostTypeId)),
  typeId: ZodUtil.convertToNumber(z.nativeEnum(PostTermTypeId)),
  statusId: ZodUtil.convertToNumber(z.nativeEnum(StatusId)).optional(),
  langId: string().optional(),
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

const putRankWithIdSchema = object({
  _id: string().min(1),
  postTypeId: z.nativeEnum(PostTypeId),
  typeId: z.nativeEnum(PostTermTypeId),
  rank: number().min(0),
});

const putViewWithIdSchema = object({
  _id: string().min(1),
  postTypeId: z.nativeEnum(PostTypeId),
  typeId: z.nativeEnum(PostTermTypeId),
  langId: string().optional(),
  url: string().optional(),
});

const deleteManySchema = object({
  postTypeId: z.nativeEnum(PostTypeId),
  typeId: z.nativeEnum(PostTermTypeId),
  _id: array(string().min(1)).min(1),
});

export type IPostTermGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IPostTermGetManySchema = z.infer<typeof getManySchema>;
export type IPostTermGetWithURLSchema = z.infer<typeof getWithURLSchema>;
export type IPostTermPostSchema = z.infer<typeof postSchema>;
export type IPostTermPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IPostTermPutStatusManySchema = z.infer<typeof putStatusManySchema>;
export type IPostTermPutRankWithIdSchema = z.infer<typeof putRankWithIdSchema>;
export type IPostTermPutViewWithIdSchema = z.infer<typeof putViewWithIdSchema>;
export type IPostTermDeleteManySchema = z.infer<typeof deleteManySchema>;

export const PostTermSchema = {
  getWithId: getWithIdSchema,
  getMany: getManySchema,
  getWithURL: getWithURLSchema,
  post: postSchema,
  putWithId: putWithIdSchema,
  putStatusMany: putStatusManySchema,
  putRankWithId: putRankWithIdSchema,
  putViewWithId: putViewWithIdSchema,
  deleteMany: deleteManySchema,
};
