import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { ZodUtil } from '@utils/zod.util';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IPanelLanguageKeys } from 'types/constants/panelLanguageKeys';

type IComponentProps = {
  title?: string;
  titleElement?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function ComponentFormInput(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  useDidMount(() => {
    console.log('didMount', props.name);
  });

  useEffectAfterDidMount(() => {
    console.log('useEffectAfterDidMount', props.name);
  }, [props.type]);

  const idRef = React.useRef<string>(String.createId());
  const registeredInput =
    props.name && register(props.name, { required: props.required });

  const Input = () => {
    switch (props.type) {
      case `textarea`:
        return (
          <textarea
            id={idRef.current}
            {...registeredInput}
            {...props}
            className={`field textarea ${typeof props.className !== 'undefined' ? props.className : ``}`}
          >
            {props.value}
          </textarea>
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

  const input = React.useMemo(() => <Input />, [props.type]);

  return (
    <div className="theme-input">
      {input}
      <label className="label" htmlFor={idRef.current}>
        {props.title} {props.titleElement}
      </label>
      {props.name &&
        errors &&
        errors[props.name] &&
        errors[props.name]?.message && (
          <div className="error">
            {t(ZodUtil.getErrorText(errors[props.name]?.type), [
              props.title ?? t(props.name as IPanelLanguageKeys),
            ])}
          </div>
        )}
    </div>
  );
}
