import { array, boolean, number, object, string, z } from 'zod';
import { StatusId } from '@constants/status';
import { ZodUtil } from '@utils/zod.util';

const schema = object({
  title: string().min(1),
  image: string().min(1),
  shortKey: string().min(1),
  locale: string().min(1),
  statusId: z.nativeEnum(StatusId),
  rank: number().default(0),
  isDefault: boolean().default(false),
});

const postSchema = schema;

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(schema);

const putRankWithIdSchema = object({
  _id: string().min(1),
  rank: number().min(0),
});

export type ILanguagePostSchema = z.infer<typeof postSchema>;
export type ILanguagePutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type ILanguagePutRankWithIdSchema = z.infer<typeof putRankWithIdSchema>;

export const LanguageSchema = {
  post: postSchema,
  putWithId: putWithIdSchema,
  putRankWithId: putRankWithIdSchema,
};
