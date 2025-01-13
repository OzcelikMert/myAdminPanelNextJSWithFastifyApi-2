import { z, ZodTypeAny } from 'zod';

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

export const ZodUtil = {
  convertToNumber: convertToNumber,
  convertToArray: convertToArray,
};
