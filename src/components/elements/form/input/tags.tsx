import React from 'react';
import { VariableLibrary } from '@library/variable';

type IComponentState = {
  tags: string[];
  currentTags: string;
};

const initialState: IComponentState = {
  tags: [],
  currentTags: '',
};

type IComponentProps = {
  value: string[];
  onChange: (value: string[], name?: string) => void;
  name?: string;
  title?: string;
  placeHolder?: string;
};

export default function ComponentFormTags(props: IComponentProps) {
  const [tags, setTags] = React.useState<string[]>(props.value);
  const [currentTags, setCurrentTags] = React.useState<string>('');

  React.useEffect(() => {
    setTags(props.value);
  }, [props.value]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTags(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !VariableLibrary.isEmpty(currentTags)) {
      const newTag = currentTags.trim();

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setCurrentTags('');
        props.onChange(tags, props.name);
      }
    }
  };

  const onRemove = (tag: string) => {
    setTags(tags.filter((item) => item != tag));
    props.onChange(tags, props.name);
  };

  const Tag = (props: { title: string }) => (
    <span className="tag">
      {props.title}
      <button
        type="button"
        className="btn btn-gradient-danger delete"
        onClick={() => onRemove(props.title)}
      >
        <i className="mdi mdi-close"></i>
      </button>
    </span>
  );

  return (
    <div className="theme-input static">
      <span className="label">{props.title}</span>
      <div className="tags field">
        {tags.map((tag, index: any) => (
          <Tag title={tag} key={index} />
        ))}
        <input
          type="text"
          name={props.name}
          value={currentTags}
          onChange={(event) => onChange(event)}
          onKeyDown={(event) => onKeyDown(event)}
          placeholder={props.placeHolder}
        />
      </div>
    </div>
  );
};
