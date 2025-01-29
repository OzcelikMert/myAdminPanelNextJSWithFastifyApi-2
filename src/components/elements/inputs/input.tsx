import React from 'react';

const Input = React.memo(
  React.forwardRef((props: IComponentInputProps, ref: any) => {
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
  })
);

export type IComponentInputProps = {
  title?: string;
  titleElement?: React.ReactNode;
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
      </div>
    );
  })
);

export default ComponentInput;
