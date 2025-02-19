import ComponentToolTip from '@components/elements/tooltip';
import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormContext } from 'react-hook-form';
import { IFormFieldError } from '@components/theme/form';
import { ObjectUtil } from '@utils/object.util';

type IIconProps = {
  iconFontSize?: '1' | '2' | '3' | '4' | '5' | '6';
};

const Icon = (props: IIconProps) => {
  return (
    <i
      className={`mdi mdi-alert-circle text-danger fs-${props.iconFontSize ?? '4'}`}
    ></i>
  );
};

type IComponentProps = {
  keys: string[];
  hideFieldTitles?: boolean;
  className?: string;
} & IIconProps;

const ComponentThemeToolTipFormFieldErrors = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    const form = useFormContext();

    const errors: IFormFieldError[] = [];

    if (form.formState.submitCount > 0) {
      for (const key of props.keys) {
        const newError = ObjectUtil.getWithKey(form.formState.errors, key);
        if (newError) {
          errors.push(newError);
        }
      }
    }

    return errors.length > 0 ? (
      <ComponentToolTip
        message={
          props.hideFieldTitles
            ? t('warningAboutFormFieldError')
            : t('warningAboutFormFieldErrorsWithVariable', [
                errors.map((error) => error.title).join(', '),
              ])
        }
      >
        <div className={`d-inline-block ${props.className ?? ''}`}>
          <Icon iconFontSize={props.iconFontSize} />
        </div>
      </ComponentToolTip>
    ) : null;
  }
);

export default ComponentThemeToolTipFormFieldErrors;
