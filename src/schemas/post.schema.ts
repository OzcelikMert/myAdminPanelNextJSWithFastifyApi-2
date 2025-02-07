import { object, string, number, array, boolean, z } from 'zod';
import { ProductTypeId } from '@constants/productTypes';
import { StatusId } from '@constants/status';
import { PostTypeId } from '@constants/postTypes';
import { PageTypeId } from '@constants/pageTypes';
import { AttributeTypeId } from '@constants/attributeTypes';
import { ZodUtil } from '@utils/zod.util';
import { PostSortTypeId } from '@constants/postSortTypes';

const schemaECommerceShipping = object({
  width: string().default(''),
  height: string().default(''),
  depth: string().default(''),
  weight: string().default(''),
});

const schemaECommerceInventory = object({
  sku: string().default(''),
  quantity: number().default(0),
  isManageStock: boolean().default(false),
});

const schemaECommercePricing = object({
  taxRate: number().default(0),
  taxExcluded: number().default(0),
  taxIncluded: number().default(0),
  compared: number().default(0),
  shipping: number().default(0),
});

const schemaECommerceAttribute = object({
  _id: string().optional(),
  typeId: z.nativeEnum(AttributeTypeId),
  attributeTermId: string().min(1),
  variationTerms: array(string().min(1)).min(1),
});

const schemaECommerceVariationOption = object({
  _id: string().optional(),
  attributeId: string().min(1),
  variationTermId: string().min(1),
});

const schemaECommerceVariationProduct = object({
  _id: string().min(1),
  statusId: z.nativeEnum(StatusId),
  contents: object({
    langId: string().min(1),
    title: string().min(3),
    icon: string().optional(),
    image: string().optional(),
    url: string().optional(),
    content: string().optional(),
    shortContent: string().optional(),
  }),
  eCommerce: object({
    images: array(string().min(1)).default([]),
    pricing: schemaECommercePricing,
    inventory: schemaECommerceInventory,
    shipping: schemaECommerceShipping,
  }),
});

const schemaECommerceVariation = object({
  _id: string().optional(),
  options: array(schemaECommerceVariationOption).default([]),
  productId: string().optional(),
  product: schemaECommerceVariationProduct,
});

const schemaECommerce = object({
  typeId: z.nativeEnum(ProductTypeId),
  images: array(string().min(1)).default([]),
  pricing: schemaECommercePricing.optional(),
  inventory: schemaECommerceInventory.optional(),
  shipping: schemaECommerceShipping.optional(),
  attributes: array(schemaECommerceAttribute).default([]),
  variations: array(schemaECommerceVariation).default([]),
  defaultVariationOptions: array(schemaECommerceVariationOption).default([]),
});

const schemaContentButton = object({
  title: string().min(1),
  url: string().optional(),
});

const schemaBeforeAndAfter = object({
  imageBefore: string().min(1),
  imageAfter: string().min(1),
  images: array(string().min(1)).default([]),
});

const schemaContent = object({
  langId: string().min(1),
  title: string().min(3),
  image: string().optional(),
  icon: string().optional(),
  url: string().optional(),
  content: string().optional(),
  shortContent: string().optional(),
  buttons: array(schemaContentButton).optional(),
});

const schemaProduct = object({
  statusId: z.nativeEnum(StatusId),
  categories: array(string().min(1)).default([]),
  tags: array(string().min(1)).default([]),
  authors: array(string().min(1)).optional(),
  dateStart: string().optional(),
  rank: number().min(0),
  isFixed: boolean().default(false),
  contents: schemaContent,
  similarItems: array(string().min(1)).optional(),
  eCommerce: schemaECommerce,
});

const schema = object({
  typeId: z.nativeEnum(PostTypeId),
  statusId: z.nativeEnum(StatusId),
  pageTypeId: z.nativeEnum(PageTypeId).optional(),
  categories: array(string().min(1)).default([]),
  tags: array(string().min(1)).default([]),
  authors: array(string().min(1)).optional(),
  dateStart: string().optional(),
  rank: number().min(0),
  isFixed: boolean().default(false),
  isNoIndex: boolean().optional(),
  contents: schemaContent,
  beforeAndAfter: schemaBeforeAndAfter.optional(),
  components: array(string().min(1)).optional(),
  similarItems: array(string().min(1)).optional(),
});

const postSchema = schema;

const postProductSchema = object({
  body: schemaProduct,
});

const putWithIdSchema = object({
  _id: string().min(1),
}).merge(schema);

const putProductWithIdSchema = object({
  _id: string().min(1),
}).merge(schemaProduct);

export type IPostPostSchema = z.infer<typeof postSchema>;
export type IPostPostProductSchema = z.infer<typeof postProductSchema>;
export type IPostPutWithIdSchema = z.infer<typeof putWithIdSchema>;
export type IPostPutProductWithIdSchema = z.infer<
  typeof putProductWithIdSchema
>;

export const PostSchema = {
  post: postSchema,
  postProduct: postProductSchema,
  putWithId: putWithIdSchema,
  putProductWithId: putProductWithIdSchema
};
