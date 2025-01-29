import React from 'react';
import { AuthService } from '@services/auth.service';
import Image from 'next/image';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { setSessionAuthState } from '@redux/features/sessionSlice';
import { setIsLockState } from '@redux/features/appSlice';
import { selectTranslation } from '@redux/features/translationSlice';
import { useDidMount } from '@library/react/hooks';
import ComponentToolLockForm from './form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema } from 'schemas/auth.schema';

type IComponentState = {
  isWrong: boolean;
};

const initialState: IComponentState = {
  isWrong: false,
};

export type IComponentToolLockFormState = {
  password: string;
};

const initialFormState: IComponentToolLockFormState = {
  password: '',
};

const ComponentToolLock = React.memo(() => {
  const abortControllerRef = React.useRef(new AbortController());

  const appDispatch = useAppDispatch();
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const t = useAppSelector(selectTranslation);

  const [isWrong, setIsWrong] = React.useState(initialState.isWrong);
  const form = useForm<IComponentToolLockFormState>({
    defaultValues: initialFormState,
    resolver: zodResolver(AuthSchema.postLock),
  });

  useDidMount(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  });

  const onSubmit = async (data: IComponentToolLockFormState) => {
    const params = data;
    const serviceResult = await AuthService.login(
      {
        password: params.password,
        email: sessionAuth?.user.email ?? '',
      },
      abortControllerRef.current.signal
    );

    if (serviceResult.status && serviceResult.data) {
      const resultSession = await AuthService.getSession(
        abortControllerRef.current.signal
      );
      if (resultSession.status && resultSession.data) {
        setIsWrong(false);
        form.reset(initialFormState);
        appDispatch(setSessionAuthState(resultSession.data));
        appDispatch(setIsLockState(false));
        return;
      }
    }

    setIsWrong(true);
  };

  return (
    <div className="component-tool-lock">
      <div className="content-wrapper d-flex align-items-center lock-full-bg h-100">
        <div className="row w-100 align-items-center">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form text-left p-5 text-center">
              <Image
                className="lock-profile-img img-fluid"
                src={ImageSourceUtil.getUploadedImageSrc(
                  sessionAuth?.user.image
                )}
                alt={sessionAuth?.user.name ?? ''}
                width={75}
                height={75}
              />
              <h4 className="text-center text-light mb-3 mt-3">
                {sessionAuth?.user.name}
              </h4>
              <ComponentToolLockForm
                form={form}
                onSubmit={(data) => onSubmit(data)}
                isWrong={isWrong}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentToolLock;
