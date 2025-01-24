import React from 'react';
import { VariableLibrary } from '@library/variable';
import { useEffectAfterDidMount } from '@library/react/customHooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useAppSelector } from '@redux/hooks';
import { useFormContext } from 'react-hook-form';
import { IPanelLanguageKeys } from 'types/constants/panelLanguageKeys';
import { ZodUtil } from '@utils/zod.util';

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

type IComponentProps = {
  value?: string[];
  onChange?: (value: string[], name?: string) => void;
  name?: string;
  title?: string;
  placeHolder?: string;
  valueAsNumber?: boolean;
};

const ComponentFormTags = React.memo((props: IComponentProps) => {
  const form = useFormContext();
  const registeredInput =
    form &&
    props.name &&
    form.register(props.name, { valueAsNumber: props.valueAsNumber });
  const t = useAppSelector(selectTranslation);

  const [tags, setTags] = React.useState<string[]>(
    props.value ?? initialState.tags
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (form && props.name) {
    const watchName = form.watch(props.name);
  }

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
        if (registeredInput && props.name) {
          form.setValue(props.name, newTags);
        }
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
    if (registeredInput && props.name) {
      form.setValue(props.name, newTags);
    }
    if (props.onChange) {
      props.onChange(newTags, props.name);
    }
  };

  return (
    <div className="theme-input static">
      <span className="label">{props.title}</span>
      <div className="tags field">
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

export default ComponentFormTags;
