import {
  FormEvent,
  useState,
} from 'react';
import ComponentFormLoadingButton from './button/loadingButton';

type IComponentState = {
  isSubmitting: boolean;
};

const initialState: IComponentState = {
  isSubmitting: false,
};

type IComponentProps = {
  hideSubmitButton?: boolean;
  submitButtonText?: string | React.ReactNode;
  submitButtonSubmittingText?: string;
  submitButtonClassName?: string;
  children: React.ReactNode;
  enterToSubmit?: true;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

export default function ComponentForm(props: IComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (props.onSubmit) {
      await props.onSubmit(event);
    }
    setIsSubmitting(false);
  };

  const SubmitButton = () => {
    return (
      <button
        type={'submit'}
        className={`btn-save ${props.submitButtonClassName ?? 'btn btn-gradient-success'}`}
        disabled={isSubmitting}
      >
        {props.submitButtonText}
      </button>
    );
  };

  return (
    <form
      className="theme-form"
      onKeyDown={(event) => {
        if (!props.enterToSubmit && event.key === 'Enter')
          event.preventDefault();
      }}
      onSubmit={(e) => onSubmit(e)}
    >
      {props.children}
      <div className="submit-btn-div text-end mb-4">
        {props.hideSubmitButton ? null : !isSubmitting ? (
          <SubmitButton />
        ) : (
          <ComponentFormLoadingButton text={props.submitButtonSubmittingText} className={props.submitButtonClassName} />
        )}
      </div>
    </form>
  );
}
