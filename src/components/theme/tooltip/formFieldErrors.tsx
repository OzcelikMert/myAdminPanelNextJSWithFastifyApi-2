import ComponentToolTip from '@components/elements/tooltip';
import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormContext } from 'react-hook-form';
import { IFormFieldError } from '@components/theme/form';
import { useEffectAfterDidMount } from '@library/react/hooks';
import { ObjectUtil } from '@utils/object.util';

const Icon = () => {
  return <i className={`mdi mdi-alert-circle text-danger fs-4`}></i>;
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
  div?: boolean;
  divClass?: string;
};

const ComponentThemeToolTipFormFieldErrors = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);
    const form = useFormContext();

    const [errors, setErrors] = React.useState(initialState.errors);

    useEffectAfterDidMount(() => {
      findErrors();
    }, [form.formState.errors]);

    const findErrors = () => {
      const newErrors: IComponentState['errors'] = [];
      for (const key of props.keys) {
        const newError = ObjectUtil.getWithKey(form.formState.errors, key);
        if (newError) {
          newErrors.push(newError);
        }
      }
      setErrors(newErrors);
    };

    if (errors.length == 0) {
      return null;
    }

    return (
      <ComponentToolTip
        message={
          props.hideFieldTitles
            ? t('warningAboutFormFieldError')
            : t('warningAboutFormFieldErrorsWithVariable', [
                errors.map((error) => error.title).join(', '),
              ])
        }
      >
        {props.div ? (
          <div className={`${props.divClass ?? ''}`}>
            <Icon />
          </div>
        ) : (
          <span>
            <Icon />{' '}
          </span>
        )}
      </ComponentToolTip>
    );
  }
);

export default ComponentThemeToolTipFormFieldErrors;
