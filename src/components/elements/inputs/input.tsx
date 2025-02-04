import { omit } from 'lodash';
import React from 'react';

const Input = React.memo(
  React.forwardRef((props: IComponentInputProps, ref: any) => {
    const inputProps = omit(props, "titleElement", "hasAnError", "errorText");
    switch (props.type) {
      case `textarea`:
        return (
          <textarea
            {...inputProps}
            ref={ref}
            className={`field textarea ${props.hasAnError ? 'error' : ''} ${typeof props.className !== 'undefined' ? props.className : ``}`}
          ></textarea>
        );
      default:
        return (
          <input
            {...inputProps}
            ref={ref}
            className={`field ${props.hasAnError ? 'error' : ''} ${typeof props.className !== 'undefined' ? props.className : ``}`}
            placeholder=" "
          />
        );
    }
  })
);

export type IComponentInputProps = {
  title?: string;
  titleElement?: React.ReactNode;
  hasAnError?: boolean;
  errorText?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ComponentInput = React.memo(
  React.forwardRef<any, IComponentInputProps>((props, ref) => {
    const idRef = React.useRef<string>(String.createId());

    return (
      <div className="theme-input">
        <Input id={idRef.current} {...props} ref={ref} />
        <label className="label" htmlFor={props.id ?? idRef.current}>
          {props.title} {props.titleElement}
        </label>
        {props.hasAnError ? (
          <div className="error-text">{props.errorText}</div>
        ) : null}
      </div>
    );
  })
);

export default ComponentInput;
