import ComponentToolTip from '@components/elements/tooltip';
import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormContext } from 'react-hook-form';
import { IFormFieldError } from '@components/theme/form';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
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

type IComponentState = {
  errors: IFormFieldError[];
};

const initialState: IComponentState = {
  errors: [],
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

    const [errors, setErrors] = React.useState(initialState.errors);

    useDidMount(() => {
      findErrors();
    });

    useEffectAfterDidMount(() => {
      findErrors();
    }, [form.formState.errors, form.formState]);

    const findErrors = () => {
      const newErrors: IComponentState['errors'] = [];
      for (const key of props.keys) {
        const newError = ObjectUtil.getWithKey(form.formState.errors, key);
        if (newError) {
          newErrors.push(newError);
        }
      }
      
      if (JSON.stringify(errors) != JSON.stringify(newErrors)) {
        setErrors(newErrors);
      }
    };

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
