import { IPanelLanguageKeys } from 'types/constants/panelLanguageKeys';
import { z, ZodIssueCode, ZodSchema, ZodTypeAny } from 'zod';

export enum ZodUtilVariableType {
  Number = 1,
  String,
}

const convertToNumber = <T extends ZodTypeAny>(schema: T) => {
  return z.preprocess((a) => {
    if (typeof a === 'string') {
      return Number(a) || a;
    }
    return a;
  }, schema);
};

const convertToArray = <T extends ZodTypeAny>(schema: T) => {
  return z.preprocess((a) => {
    if (!Array.isArray(a)) {
      return [a];
    }
    return a;
  }, schema);
};

const check = <T = any>(
  validationSchema: ZodSchema<T>
) => async (data: T) => {
  return validationSchema.safeParseAsync(data);
}

const getErrorText = (errorCode?: any): IPanelLanguageKeys => {
  switch (errorCode as ZodIssueCode) {
    case 'invalid_string':
    case 'invalid_arguments':
    case 'invalid_date':
    case 'invalid_enum_value':
    case 'invalid_intersection_types':
    case 'invalid_literal':
    case 'invalid_type':
    case 'invalid_return_type':
    case 'invalid_union':
    case 'invalid_union_discriminator':
    case 'too_big':
      return 'fillCorrectlyWithName';
    case 'too_small':
      return 'inputIsRequiredWithName';
    default:
      return '[noLangAdd]';
  }
};

export const ZodUtil = {
  convertToNumber: convertToNumber,
  convertToArray: convertToArray,
  check: check,
  getErrorText: getErrorText
};
