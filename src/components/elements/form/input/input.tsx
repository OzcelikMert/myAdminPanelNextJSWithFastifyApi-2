import { useEffectAfterDidMount } from '@library/react/customHooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { ZodUtil } from '@utils/zod.util';
import moment from 'moment';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IPanelLanguageKeys } from 'types/constants/panelLanguageKeys';

type IComponentProps = {
  title?: string;
  titleElement?: React.ReactNode;
  valueAsNumber?: boolean;
  valueAsDate?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ComponentFormInput = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const form = useFormContext();

  const idRef = React.useRef<string>(String.createId());
  const typeRef = React.useRef<string>(props.type);
  const registeredInput =
    form && props.name
      ? form.register(props.name, {
          required: props.required,
          setValueAs: value => {
            if(props.valueAsNumber || props.type == 'number'){
              return Number(value);
            }else if(props.valueAsDate || props.type == 'date') {
              return moment(value).format('YYYY-MM-DD');
            }

            return value;
          },
        })
      : undefined;

  useEffectAfterDidMount(() => {
    if (props.type != typeRef.current) {
      inputRef.current = <Input />;
      typeRef.current = props.type;
    }
  }, [props.type]);

  const Input = () => {
    switch (props.type) {
      case `textarea`:
        return (
          <textarea
            id={idRef.current}
            {...registeredInput}
            {...props}
            className={`field textarea ${typeof props.className !== 'undefined' ? props.className : ``}`}
          ></textarea>
        );
      default:
        return (
          <input
            id={idRef.current}
            {...registeredInput}
            {...props}
            className={`field ${typeof props.className !== 'undefined' ? props.className : ``}`}
            placeholder=" "
          />
        );
    }
  };

  const inputRef = React.useRef<React.ReactNode>(<Input />);

  return (
    <div className="theme-input">
      {inputRef.current}
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
