import { array, boolean, number, object, string, z } from 'zod';
import { CurrencyId } from '@constants/currencyTypes';
import { PanelLanguageId } from '@constants/panelLanguages';

const schemaPathContent = object({
  _id: string().optional(),
  langId: string().min(1),
  asPath: string().min(1),
});

const schemaPath = object({
  _id: string().optional(),
  key: string().min(1),
  title: string().min(1),
  path: string().min(1),
  contents: schemaPathContent,
});

const schemaContactForm = object({
  _id: string().optional(),
  title: string().min(1),
  name: string().min(1),
  key: string().min(1),
  targetEmail: string().min(1),
  email: string().min(1),
  password: string().optional(),
  host: string().min(1),
  port: number().min(1),
  hasSSL: boolean().default(false),
});

const schemaSocialMedia = object({
  _id: string().optional(),
  key: string().default(''),
  title: string().default(''),
  url: string().default(''),
});

const schemaECommerce = object({
  currencyId: z.nativeEnum(CurrencyId),
});

const schemaContact = object({
  email: string().optional(),
  phone: string().optional(),
  address: string().optional(),
  addressMap: string().optional(),
});

const schemaSEOContent = object({
  langId: string().min(1),
  title: string().optional(),
  content: string().optional(),
  tags: array(string().min(1)).default([]),
});

const putGeneralSchema = object({
  icon: string().optional(),
  logo: string().optional(),
  logoTwo: string().optional(),
  head: string().optional(),
  script: string().optional(),
  googleAnalyticURL: string().optional(),
  contact: schemaContact,
  panelLangId: z.nativeEnum(PanelLanguageId),
});

const putSeoSchema = object({
  seoContents: schemaSEOContent,
});

const putContactFormSchema = object({
  contactForms: array(schemaContactForm).min(1),
});

const putSocialMediaSchema = object({
  socialMedia: array(schemaSocialMedia).min(1),
});

const putECommerceSchema = object({
  eCommerce: schemaECommerce,
});

const putPathSchema = object({
  paths: array(schemaPath).min(1),
});

export type ISettingPutGeneralSchema = z.infer<typeof putGeneralSchema>;
export type ISettingPutSEOSchema = z.infer<typeof putSeoSchema>;
export type ISettingPutContactFormSchema = z.infer<typeof putContactFormSchema>;
export type ISettingPutSocialMediaSchema = z.infer<typeof putSocialMediaSchema>;
export type ISettingPutECommerceSchema = z.infer<typeof putECommerceSchema>;
export type ISettingPutPathSchema = z.infer<typeof putPathSchema>;

export const SettingSchema = {
  putGeneral: putGeneralSchema,
  putSeo: putSeoSchema,
  putContactForm: putContactFormSchema,
  putSocialMedia: putSocialMediaSchema,
  putECommerce: putECommerceSchema,
  putPath: putPathSchema,
};
