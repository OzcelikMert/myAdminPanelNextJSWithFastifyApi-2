import { object, string, number, array, boolean, z } from 'zod';
import { StatusId } from '@constants/status';

const schemaContent = object({
  langId: string().min(1),
  title: string().min(1),
  url: string().min(1),
});

const schema = object({
  parentId: string().optional().default(''),
  statusId: z.nativeEnum(StatusId),
  rank: number().min(0),
  isPrimary: boolean().optional(),
  isSecondary: boolean().optional(),
  contents: schemaContent,
});

const postSchema = schema;

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(schema);

const putStatusManySchema = object({
  _id: array(string().min(1)).min(1),
  statusId: z.nativeEnum(StatusId),
});

const putRankWithIdSchema = object({
  _id: string().min(1),
  rank: number().min(0),
});

export type INavigationPostSchema = z.infer<typeof postSchema>;
export type INavigationPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type INavigationPutStatusManySchema = z.infer<
  typeof putStatusManySchema
>;
export type INavigationPutRankWithIdSchema = z.infer<
  typeof putRankWithIdSchema
>;

export const NavigationSchema = {
  post: postSchema,
  putWithId: putWithIdSchema,
  putStatusMany: putStatusManySchema,
  putRankWithId: putRankWithIdSchema,
};
