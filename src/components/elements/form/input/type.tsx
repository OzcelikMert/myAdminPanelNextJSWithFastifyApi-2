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
    formState: { errors },
  } = useFormContext();

  switch (props.type) {
    case `textarea`:
      input = (
        <textarea
          {...props}
          {...(props.name && register(props.name))}
          className={`field textarea ${typeof props.className !== 'undefined' ? props.className : ``}`}
        >
          {props.value}
        </textarea>
      );
      break;
    default:
      input = (
        <input
          {...props}
          {...(props.name && register(props.name))}
          className={`field ${typeof props.className !== 'undefined' ? props.className : ``}`}
          placeholder=" "
        />
      );
      break;
  }

  return (
    <div className="theme-input">
      {input}
      <span className="label">
        {props.title} {props.titleElement}
      </span>
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
