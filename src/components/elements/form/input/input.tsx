import { useEffectAfterDidMount } from '@library/react/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { ZodUtil } from '@utils/zod.util';
import moment from 'moment';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IPanelLanguageKeys } from 'types/constants/panelLanguageKeys';

const Input = React.memo(React.forwardRef<any>(
  (
    props: React.InputHTMLAttributes<HTMLInputElement> &
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      ref
  ) => {
    switch (props.type) {
      case `textarea`:
        return (
          <textarea
            {...props}
            ref={ref}
            className={`field textarea ${typeof props.className !== 'undefined' ? props.className : ``}`}
          ></textarea>
        );
      default:
        return (
          <input
            {...props}
            ref={ref}
            className={`field ${typeof props.className !== 'undefined' ? props.className : ``}`}
            placeholder=" "
          />
        );
    }
  }
));

export type IComponentFormInputProps = {
  title?: string;
  titleElement?: React.ReactNode;
  valueAsNumber?: boolean;
  valueAsDate?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ComponentFormInput = React.memo((props: IComponentFormInputProps) => {
  const t = useAppSelector(selectTranslation);
  const form = useFormContext();

  const registeredInput =
    form && props.name
      ? form.register(props.name, {
          required: props.required,
          setValueAs: (value) => {
            if (props.valueAsNumber || props.type == 'number') {
              return Number(value);
            } else if (props.valueAsDate || props.type == 'date') {
              return moment(value).format('YYYY-MM-DD');
            }

            return value;
          },
        })
      : undefined;
  const idRef = React.useRef<string>(String.createId());
  
  return (
    <div className="theme-input">
      <Input {...registeredInput} id={idRef.current} {...props} />
      <label className="label" htmlFor={props.id ?? idRef.current}>
        {props.title} {props.titleElement}
      </label>
      {form &&
        props.name &&
        form.formState.errors &&
        form.formState.errors[props.name] &&
        form.formState.errors[props.name]?.message && (
          <div className="error">
            {t(ZodUtil.getErrorText(form.formState.errors[props.name]?.type), [
              props.title ?? t(props.name as IPanelLanguageKeys),
            ])}
          </div>
        )}
    </div>
  );
});

export default ComponentFormInput;
