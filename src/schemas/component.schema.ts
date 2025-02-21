import { object, string, number, array, z } from 'zod';
import { ElementTypeId } from '@constants/elementTypes';
import { ComponentTypeId } from '@constants/componentTypes';

const schemaElementContent = object({
  url: string().optional(),
  langId: string().min(1),
  content: string().optional(),
});

const schemaElement = object({
  _id: string().min(1),
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

const postSchema = schema;

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(postSchema);

export type IComponentPostSchema = z.infer<typeof postSchema>;
export type IComponentPutWithIdSchema = z.infer<typeof putWithIdSchema>;

export const ComponentSchema = {
  post: postSchema,
  putWithId: putWithIdSchema,
};
