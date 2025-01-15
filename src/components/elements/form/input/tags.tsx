import React from 'react';
import { VariableLibrary } from '@library/variable';
import { useEffectAfterDidMount } from '@library/react/customHooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { useFormContext } from 'react-hook-form';
import { IPanelLanguageKeys } from 'types/constants/panelLanguageKeys';
import { ZodUtil } from '@utils/zod.util';

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
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const registeredInput = props.name && register(props.name);
  const t = useAppSelector(selectTranslation);

  const [tags, setTags] = React.useState<string[]>(props.value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffectAfterDidMount(() => {
    setTags(props.value);
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
        if (props.name) {
          setValue(props.name, newTags);
        }
        inputRef.current.value = '';
        props.onChange(newTags, props.name);
      }
    }
  };

  const onRemove = (tag: string) => {
    const newTags = tags.filter((item) => item != tag);
    setTags(newTags);
    if (props.name) {
      setValue(props.name, newTags);
    }
    props.onChange(newTags, props.name);
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
          ref={inputRef}
          name={props.name}
          onKeyDown={(event) => onKeyDown(event)}
          placeholder={props.placeHolder}
        />
      </div>
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
