import React from 'react';

type IComponentProps = {
  title?: string;
  titleElement?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function ComponentFormType(props: IComponentProps) {
  let input:  React.ReactNode;

  switch (props.type) {
    case `textarea`:
      input = (
        <textarea
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
          {...props}
          className={`field ${typeof props.className !== 'undefined' ? props.className : ``}`}
          placeholder=" "
        />
      );
      break;
  }
  return (
    <label className="theme-input">
      {input}
      <span className="label">
        {props.title} {props.titleElement}
      </span>
    </label>
  );
};