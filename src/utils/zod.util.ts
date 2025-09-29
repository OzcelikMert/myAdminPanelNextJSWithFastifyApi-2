import { z, ZodSchema, ZodTypeAny } from 'zod';

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

const getParsedData =
  <T = any>(validationSchema: ZodSchema<T>) =>
  async (data: T) => {
    return validationSchema.safeParseAsync(data);
  };

const validationResolver =
  <T = any>(validationSchema: z.ZodSchema) =>
  async (data: T) => {
    const validatedData = await getParsedData(validationSchema)(data);
    if (validatedData.success) {
      return {
        values: validatedData.data,
        errors: {},
      };
    } else {
      return {
        values: {},
        errors: validatedData.error.issues.reduce((allErrors, currentError) => {
          return {
            ...allErrors,
            [currentError.path[0]]: {
              type: currentError.code ?? 'invalid_string',
              message: currentError.message,
            },
          };
        }, {}),
      };
    }
  };

export const ZodUtil = {
  convertToNumber: convertToNumber,
  convertToArray: convertToArray,
  getParsedData: getParsedData,
  validationResolver: validationResolver,
};
