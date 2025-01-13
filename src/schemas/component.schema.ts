import { object, string, number, array, z } from 'zod';
import { ElementTypeId } from '@constants/elementTypes';
import { ComponentTypeId } from '@constants/componentTypes';
import { ZodUtil } from '@utils/zod.util';

const schemaElementContent = object({
  url: string().optional(),
  langId: string().min(1),
  content: string().optional(),
});

const schemaElement = object({
  _id: string().optional(),
  key: string().min(1),
  typeId: z.nativeEnum(ElementTypeId),
  title: string().min(1),
  rank: number().min(0),
  contents: schemaElementContent,
});

const schema = object({
  key: string().min(1),
  title: string().min(1),
  typeId: z.nativeEnum(ComponentTypeId),
  elements: array(schemaElement).min(1),
});

const getWithIdSchema = object({
  _id: string().min(1),
  langId: string().optional(),
});

const getWithKeySchema = object({
  key: string().min(1),
  langId: string().optional(),
});

const getManySchema = object({
  _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
  langId: string().optional(),
  key: ZodUtil.convertToArray(array(string().min(1))).optional(),
  typeId: ZodUtil.convertToNumber(z.nativeEnum(ComponentTypeId)).optional(),
  withContent: z.coerce.boolean().optional(),
  withCustomSort: z.coerce.boolean().optional(),
});

const postSchema = schema

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(schema);

const deleteManySchema = object({
  _id: array(string().min(1)).min(1),
});

export type IComponentGetWithIdSchema = z.infer<typeof getWithIdSchema>;
export type IComponentGetManySchema = z.infer<typeof getManySchema>;
export type IComponentGetWithKeySchema = z.infer<typeof getWithKeySchema>;
export type IComponentPostSchema = z.infer<typeof postSchema>;
export type IComponentPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IComponentDeleteManySchema = z.infer<typeof deleteManySchema>;

export const ComponentSchema = {
  getWithId: getWithIdSchema,
  getWithKey: getWithKeySchema,
  getMany: getManySchema,
  post: postSchema,
  putWithId: putWithIdSchema,
  deleteMany: deleteManySchema,
};
