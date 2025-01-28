import { ReactNode } from 'react';
import { toast, Id, ToastOptions, ToastContent } from 'react-toastify';
import React from 'react';

const Content = React.memo(
  (props: { title: IToastProps['title']; content: IToastProps['content'] }) => {
    return (
      <div>
        {props.title ? <b className="d-block">{props.title}</b> : null}
        {React.isValidElement(props.content) ? (
          props.content
        ) : (
          <small>{props.content}</small>
        )}
      </div>
    );
  }
);

type IToastType = 'warning' | 'error' | 'success' | 'info' | 'loading';

const Colors = {
  success: '#1bcfb4',
  info: '#198ae3',
  warning: '#fed713',
  error: '#fe7c96',
  loading: '#d8d8d8',
};

export type IToastProps = {
  type?: IToastType;
  borderColor?: IToastType;
  content: ReactNode | string;
  title?: string;
  position?: ToastOptions['position'];
  timeOut?: number;
};

export type IToastReturn = {
  showToast: (props: IToastProps, id?: Id | null) => Id;
  hideToast: (id?: Id) => void;
  isToastActive: (id: Id) => boolean;
};

export const useToast = (): IToastReturn => {
  const getColor = React.useCallback((type: IToastType) => Colors[type], []);
  const getOptions = React.useCallback(
    (props: IToastProps): ToastOptions => ({
      position: props.position ?? 'top-right',
      autoClose: props.timeOut
        ? Number(props.timeOut) * 1000
        : props.type === 'loading' || typeof props.type === 'undefined'
          ? false
          : 4000,
      draggable:
        !!props.timeOut ||
        (typeof props.type !== 'undefined' && props.type !== 'loading'),
      hideProgressBar: false,
      progress: undefined,
      pauseOnHover: true,
      closeOnClick:
        !!props.timeOut ||
        (typeof props.type !== 'undefined' && props.type !== 'loading'),
      closeButton: false,
      className: 'theme-toast',
      ...(props.borderColor
        ? {
            style: {
              border: 0,
              borderColor: getColor(props.borderColor),
              borderStyle: 'solid',
              borderTopWidth: 2,
            },
          }
        : {}),
    }),
    []
  );

  const showToast = React.useCallback((props: IToastProps, id?: Id | null) => {
    let options = getOptions(props);
    const content = <Content content={props.content} title={props.title} />;
    if (id) {
      if (toast.isActive(id)) {
        toast.update(id, {
          ...options,
          type: props.type != 'loading' ? props.type : 'default',
          render: content,
        });
        return id;
      } else {
        options = {
          ...options,
          toastId: id,
        };
      }
    }
    switch (props.type) {
      case 'success':
        return toast.success(content, options);
      case 'info':
        return toast.info(content, options);
      case 'warning':
        return toast.warn(content, options);
      case 'error':
        return toast.error(content, options);
      case 'loading':
        return toast.loading(content, options);
      default:
        return toast(content, options);
    }
  }, []);

  const hideToast = React.useCallback((id?: Id) => {
    if (id && toast.isActive(id)) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  }, []);

  return {
    showToast,
    hideToast,
    isToastActive: toast.isActive,
  };
};
