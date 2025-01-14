import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ILanguageKeys } from 'types/constants/languageKeys';

type IComponentProps = {
  title?: string;
  titleElement?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function ComponentFormType(props: IComponentProps) {
  let input: React.ReactNode;
  
  const t = useAppSelector(selectTranslation);
  const {
    register,
    formState: { errors }
  } = useFormContext();

  const idRef = React.useRef<string>(String.createId());
  const registeredInput = (props.name && register(props.name, {required: props.required}));

  switch (props.type) {
    case `textarea`:
      input = (
        <textarea
          id={idRef.current}
          {...registeredInput}
          {...props}
          className={`field textarea ${typeof props.className !== 'undefined' ? props.className : ``}`}
        >
          {props.value}
        </textarea>
      );
      break;
    default:
      input = (
        <input
          id={idRef.current}
          {...registeredInput}
          {...props}
          className={`field ${typeof props.className !== 'undefined' ? props.className : ``}`}
          placeholder=" "
        />
      );
      break;
  }

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
            {t(errors[props.name]?.message as ILanguageKeys)}
          </div>
        )}
    </div>
  );
}
