import React from 'react';
import { VariableLibrary } from '@library/variable';
import { useEffectAfterDidMount } from '@library/react/hooks';

const Tag = React.memo(
  (props: { title: string; onClickRemove: (tag: string) => void }) => (
    <span className="tag">
      {props.title}
      <button
        type="button"
        className="btn btn-gradient-danger delete"
        onClick={() => props.onClickRemove(props.title)}
      >
        <i className="mdi mdi-close"></i>
      </button>
    </span>
  )
);

type IComponentState = {
  tags: string[];
  currentTags: string;
};

const initialState: IComponentState = {
  tags: [],
  currentTags: '',
};

export type IComponentInputTagsProps = {
  value?: string[];
  onChange?: (value: string[], name?: string) => void;
  name?: string;
  title?: string;
  placeHolder?: string;
  valueAsNumber?: boolean;
  required?: boolean
  hasAnError?: boolean;
  errorText?: string;
};

const ComponentInputTags = React.memo(
  React.forwardRef<any, IComponentInputTagsProps>((props, ref) => {
    const [tags, setTags] = React.useState<string[]>(
      props.value ?? initialState.tags
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffectAfterDidMount(() => {
      setTags(props.value ?? []);
    }, [props.value]);

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        event.key === 'Enter' &&
        inputRef.current?.value &&
        !VariableLibrary.isEmpty(inputRef.current?.value)
      ) {
        const newTag = inputRef.current?.value.trim();
        if (!tags.includes(newTag)) {
          const newTags = [...tags, newTag];
          setTags(newTags);
          inputRef.current.value = '';
          if (props.onChange) {
            props.onChange(newTags, props.name);
          }
        }
      }
    };

    const onClickRemove = (tag: string) => {
      const newTags = tags.filter((item) => item != tag);
      setTags(newTags);
      if (props.onChange) {
        props.onChange(newTags, props.name);
      }
    };

    return (
      <div className="theme-input static">
        <span className="label">{props.title}</span>
        <div className={`tags field ${props.hasAnError ? 'error' : ''}`}>
          {tags.map((tag, index: any) => (
            <Tag
              title={tag}
              key={index}
              onClickRemove={(tag) => onClickRemove(tag)}
            />
          ))}
          <input
            type="text"
            ref={inputRef}
            name={props.name}
            onKeyDown={(event) => onKeyDown(event)}
            placeholder={props.placeHolder}
          />
        </div>
        {props.hasAnError ? (
          <div className="error-text">{props.errorText}</div>
        ) : null}
      </div>
    );
  })
);

export default ComponentInputTags;
