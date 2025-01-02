import { SettingService } from '@services/setting.service';
import ComponentToast from '@components/elements/toast';
import { ISettingUpdatePathParamService } from 'types/services/setting.service';
import { ISettingPathModel } from 'types/models/setting.model';
import { PermissionUtil } from '@utils/permission.util';
import { SettingsEndPointPermission } from '@constants/endPointPermissions/settings.endPoint.permission';
import { SettingProjectionKeys } from '@constants/settingProjections';
import { cloneDeepWith } from 'lodash';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useEffect, useState } from 'react';
import { useFormReducer } from '@library/react/handles/form';
import ComponentForm from '@components/elements/form';
import { setBreadCrumbState } from '@lib/features/breadCrumbSlice';
import { EndPoints } from '@constants/endPoints';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormType from '@components/elements/form/input/type';
import { setIsPageLoadingState } from '@lib/features/pageSlice';

type IComponentState = {
  items?: ISettingPathModel[];
  langId: string;
};

const initialState: IComponentState = {
  items: [],
  langId: '',
};

type IComponentSelectedItemFormState = ISettingPathModel | undefined;

const initialSelectedItemFormState: IComponentSelectedItemFormState = undefined;

type IComponentFormState = ISettingUpdatePathParamService;

const initialFormState: IComponentFormState = {
  paths: [],
};

export default function PageSettingsPaths() {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const [items, setItems] = useState(initialState.items);
  const [langId, setLangId] = useState(initialState.langId);
  const selectedItemFormReducer =
    useFormReducer<IComponentSelectedItemFormState>(
      initialSelectedItemFormState
    );
  const formReducer = useFormReducer<IComponentFormState>(initialFormState);

  useEffect(() => {
    init();
    return () => {
      abortController.abort();
    };
  }, []);

  const init = async () => {
    if (
      PermissionUtil.checkAndRedirect({
        appDispatch,
        t,
        router: router,
        minPermission: SettingsEndPointPermission.UPDATE_PATH,
        sessionAuth: sessionAuth,
      })
    ) {
      await getItems();
      setPageTitle();
      appDispatch(setIsPageLoadingState(false));
    }
  };

  const changeLanguage = async (langId: string) => {
    appDispatch(setIsPageLoadingState(true));
    await getItems(langId);
    appDispatch(setIsPageLoadingState(false));
  };

  const setPageTitle = () => {
    appDispatch(
      setBreadCrumbState([
        {
          title: t('settings'),
          url: EndPoints.SETTINGS_WITH.GENERAL,
        },
        {
          title: t('paths'),
        },
      ])
    );
  };

  const getItems = async (_langId?: string) => {
    _langId = _langId || mainLangId;
    const serviceResult = await SettingService.get(
      {
        langId: _langId,
        projection: SettingProjectionKeys.Path,
      },
      abortController.signal
    );
    if (
      serviceResult.status &&
      serviceResult.data &&
      serviceResult.data.paths
    ) {
      const setting = serviceResult.data;
      const paths = setting.paths!;
      setItems(paths);
      formReducer.setFormState({
        paths: paths.map((path) => ({
          ...path,
          contents: {
            ...path.contents,
            langId: _langId,
          },
        })),
      });
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let params = formReducer.formState;
    const serviceResult = await SettingService.updatePath(
      params,
      abortController.signal
    );

    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: t('settingsUpdated'),
      });
    }
  };

  const onCreate = () => {
    let newPaths = formReducer.formState.paths;
    newPaths.push({
      title: '',
      key: '',
      path: '',
      contents: {
        langId: langId,
        asPath: '',
      },
    });

    formReducer.setFormState({
      paths: newPaths,
    });

    onEdit(newPaths.length - 1);
  };

  const onAccept = (index: number) => {
    let newPaths = formReducer.formState.paths;
    newPaths[index] = selectedItemFormReducer.formState!;
    formReducer.setFormState({
      paths: newPaths,
    });
  };

  const onEdit = (index: number) => {
    selectedItemFormReducer.setFormState(
      cloneDeepWith(formReducer.formState.paths[index])
    );
  };

  const onCancelEdit = () => {
    selectedItemFormReducer.setFormState(undefined);
  };

  const onDelete = async (index: number) => {
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: `<b>'${formReducer.formState.paths[index].key}'</b> ${t('deleteItemQuestionWithItemName')}`,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      let newPaths = formReducer.formState.paths;
      newPaths.splice(index, 1);
      formReducer.setFormState({
        paths: newPaths,
      });
    }
  };

  const Path = (props: ISettingPathModel, index: number) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet
          legend={`${props.title} (#${props.key})`}
          legendElement={
            <span>
              <i
                className="mdi mdi-pencil-box text-warning fs-1 cursor-pointer ms-2"
                onClick={() => onEdit(index)}
              ></i>
              <i
                className="mdi mdi-minus-box text-danger fs-1 cursor-pointer ms-2"
                onClick={() => onDelete(index)}
              ></i>
            </span>
          }
        >
          <div className="row">
            <div className="col-md-12">
              <ComponentFormType
                type="text"
                name={`paths.${index}.contents.asPath`}
                title={t('pathMask')}
                value={props.contents.asPath}
                onChange={(e) => formReducer.onChangeInput(e)}
              />
            </div>
          </div>
        </ComponentFieldSet>
      </div>
    );
  };

  const PathEdit = (props: ISettingPathModel, index: number) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet legend={t('newPath')}>
          <div className="row mt-3">
            <div className="col-md-12">
              <ComponentFormType
                type="text"
                name={`paths.${index}.title`}
                title={t('title')}
                value={props.title}
                onChange={(e) => selectedItemFormReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-3">
              <ComponentFormType
                type="text"
                name={`paths.${index}.key`}
                title={t('key')}
                value={props.key}
                onChange={(e) => selectedItemFormReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-3">
              <ComponentFormType
                type="text"
                name={`paths.${index}.path`}
                title={t('path')}
                value={props.path}
                onChange={(e) => selectedItemFormReducer.onChangeInput(e)}
              />
            </div>
            <div className="col-md-12 mt-3">
              <div className="row">
                <div className="col-md-6">
                  <button
                    type="button"
                    className="btn btn-gradient-success btn-lg"
                    onClick={() => onAccept(index)}
                  >
                    {t('okay')}
                  </button>
                </div>
                <div className="col-md-6 text-end">
                  <button
                    type="button"
                    className="btn btn-gradient-dark btn-lg"
                    onClick={() => onCancelEdit()}
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ComponentFieldSet>
      </div>
    );
  };

  const Paths = () => {
    return (
      <div className="row">
        <div className="col-md-7 mt-2">
          <div className="row">
            {formReducer.formState.paths?.map((item, index) =>
              selectedItemFormReducer.formState &&
              selectedItemFormReducer.formState._id == item._id
                ? PathEdit(selectedItemFormReducer.formState, index)
                : Path(item, index)
            )}
          </div>
        </div>
        <div
          className={`col-md-7 text-start ${formReducer.formState.paths.length > 0 ? 'mt-4' : ''}`}
        >
          <button
            type={'button'}
            className="btn btn-gradient-success btn-lg"
            onClick={() => onCreate()}
          >
            + {t('addNew')}
          </button>
        </div>
      </div>
    );
  };

  return isPageLoading ? null : (
    <div className="page-settings">
      <div className="row">
        <div className="col-md-12">
          <ComponentForm
            submitButtonText={t('save')}
            submitButtonSubmittingText={t('loading')}
            onSubmit={(event) => onSubmit(event)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <Paths />
                </div>
              </div>
            </div>
          </ComponentForm>
        </div>
      </div>
    </div>
  );
}
