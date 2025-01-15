import { useCallback } from 'react';
import * as zod from 'zod';
import { ZodUtil } from './zod.util';

const useZodValidationResolver = <T = any>(
  validationSchema: zod.ZodSchema<T>
) =>
  useCallback(
    async (data: T) => {
      const validatedData = await ZodUtil.check(validationSchema)(data);
      if (validatedData.success) {
        return {
          values: validatedData.data,
          errors: {},
        };
      } else {
        return {
          values: {},
          errors: validatedData.error.errors.reduce(
            (allErrors, currentError) => {
              return {
                ...allErrors,
                [currentError.path[0]]: {
                  type: currentError.code ?? 'invalid_string',
                  message: currentError.message,
                },
              };
            },
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

export const CustomHookUtil = {
  useZodValidationResolver: useZodValidationResolver,
};
