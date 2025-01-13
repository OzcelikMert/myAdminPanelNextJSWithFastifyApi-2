import { object, string, array, z } from 'zod';
import { GalleryTypeId } from '@constants/galleryTypeId';
import { ZodUtil } from '@utils/zod.util';

const getManySchema = object({
  _id: ZodUtil.convertToArray(array(string().min(1))).optional(),
  name: ZodUtil.convertToArray(array(string().min(1))).optional(),
  typeId: ZodUtil.convertToNumber(z.nativeEnum(GalleryTypeId)).optional(),
});

const deleteManySchema = object({
  _id: array(string().min(1)),
});

export type IGalleryGetManySchema = z.infer<typeof getManySchema>;
export type IGalleryDeleteManySchema = z.infer<typeof deleteManySchema>;

export const GallerySchema = {
  getMany: getManySchema,
  deleteMany: deleteManySchema,
};
