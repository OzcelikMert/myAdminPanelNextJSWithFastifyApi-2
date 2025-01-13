import { FormEvent, useReducer, useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import {
  IComponentElementGetResultService,
  IComponentGetResultService,
} from 'types/services/component.service';
import { IComponentElementModel } from 'types/models/component.model';
import { PermissionUtil } from '@utils/permission.util';
import { ComponentEndPointPermission } from '@constants/endPointPermissions/component.endPoint.permission';
import { ElementTypeId, elementTypes } from '@constants/elementTypes';
import { ComponentService } from '@services/component.service';
import { EndPoints } from '@constants/endPoints';
import { cloneDeepWith } from 'lodash';
import { UserRoleId } from '@constants/userRoles';
import ComponentPageComponentElementTypeInput from '@components/pages/component/add/elementTypeInput';
import { ComponentTypeId, componentTypes } from '@constants/componentTypes';
import { RouteUtil } from '@utils/route.util';
import ComponentToast from '@components/elements/toast';
import ComponentThemeToolTipMissingLanguages from '@components/theme/tooltip/missingLanguages';
import { useFormReducer } from '@library/react/handles/form';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useRouter } from 'next/router';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentForm from '@components/elements/form';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import ComponentThemeContentLanguage from '@components/theme/contentLanguage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ComponentSchema,
  IComponentPutWithIdSchema,
} from 'schemas/component.schema';
import ComponentThemeModalEditComponentElement from '@components/theme/modal/editComponentElement';

type IHandleInputChangeParams = {
  index: number;
  key: string;
  value: any;
};

type IComponentState = {
  elementTypes: IThemeFormSelectData<ElementTypeId>[];
  componentTypes: IThemeFormSelectData<ComponentTypeId>[];
  mainTabActiveKey: string;
  isItemLoading: boolean;
  item?: IComponentGetResultService;
  langId: string;
  isShowModalEditElement: boolean;
  selectedElementId: string;
};

const initialState: IComponentState = {
  elementTypes: [],
  componentTypes: [],
  mainTabActiveKey: 'general',
  isItemLoading: false,
  langId: '',
  isShowModalEditElement: false,
  selectedElementId: '',
};

enum ActionTypes {
  SET_ELEMENT_TYPES,
  SET_COMPONENT_TYPES,
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_MAIN_TITLE,
  SET_ITEM,
  SET_LANG_ID,
  SET_IS_ITEM_LOADING,
  SET_IS_SHOW_MODAL_EDIT_ELEMENT,
  SET_SELECTED_ELEMENT_ID,
}

type IAction =
  | {
      type: ActionTypes.SET_ELEMENT_TYPES;
      payload: IComponentState['elementTypes'];
    }
  | {
      type: ActionTypes.SET_COMPONENT_TYPES;
      payload: IComponentState['componentTypes'];
    }
  | {
      type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IComponentState['mainTabActiveKey'];
    }
  | {
      type: ActionTypes.SET_IS_ITEM_LOADING;
      payload: IComponentState['isItemLoading'];
    }
  | {
      type: ActionTypes.SET_ITEM;
      payload: IComponentState['item'];
    }
  | { type: ActionTypes.SET_LANG_ID; payload: IComponentState['langId'] }
  | {
      type: ActionTypes.SET_IS_SHOW_MODAL_EDIT_ELEMENT;
      payload: IComponentState['isShowModalEditElement'];
    }
  | {
      type: ActionTypes.SET_SELECTED_ELEMENT_ID;
      payload: IComponentState['selectedElementId'];
    };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_ELEMENT_TYPES:
      return { ...state, elementTypes: action.payload };
    case ActionTypes.SET_COMPONENT_TYPES:
      return { ...state, componentTypes: action.payload };
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_IS_ITEM_LOADING:
      return { ...state, isItemLoading: action.payload };
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    case ActionTypes.SET_LANG_ID:
      return { ...state, langId: action.payload };
    case ActionTypes.SET_IS_SHOW_MODAL_EDIT_ELEMENT:
      return { ...state, isShowModalEditElement: action.payload };
    case ActionTypes.SET_SELECTED_ELEMENT_ID:
      return { ...state, selectedElementId: action.payload };
    default:
      return state;
  }
};

type IComponentSelectedItemFormState = IComponentElementModel | undefined;

const initialSelectedItemFormState: IComponentSelectedItemFormState = undefined;

type IComponentFormState = IComponentPutWithIdSchema;

const initialFormState: IComponentFormState = {
  _id: '',
  elements: [],
  key: '',
  title: '',
  typeId: ComponentTypeId.Private,
};

type IPageQueries = {
  _id?: string;
};

export default function PageComponentAdd() {
  const abortController = new AbortController();

  const router = useRouter();
  const appDispatch = useAppDispatch();
  const t = useAppSelector(selectTranslation);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);

  const queries = router.query as IPageQueries;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    langId: mainLangId,
    mainTabActiveKey: PermissionUtil.checkPermissionRoleRank(
      sessionAuth!.user.roleId,
      UserRoleId.SuperAdmin
    )
      ? 'general'
      : 'elements',
  });
  const form = useForm<IComponentFormState>({
    defaultValues: {
      ...initialFormState,
      _id: queries._id ?? '',
    },
    resolver: zodResolver(
      queries._id ? ComponentSchema.putWithId : ComponentSchema.post
    ),
  });
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const mainTitleRef = useRef<string>('');

  useDidMount(() => {
    init();
    return () => {
      abortController.abort();
    };
  });

  useEffectAfterDidMount(() => {
    if (isPageLoaded) {
      appDispatch(setIsPageLoadingState(false));
    }
  }, [isPageLoaded]);

  const init = async () => {
    if (isPageLoaded) {
      setIsPageLoaded(false);
    }
    const minPermission = queries._id
      ? ComponentEndPointPermission.UPDATE
      : ComponentEndPointPermission.ADD;
    if (
      PermissionUtil.checkAndRedirect({
        minPermission,
        router,
        sessionAuth,
        t,
      })
    ) {
      getElementTypes();
      getComponentTypes();
      if (queries._id) {
        await getItem();
      }
      setPageTitle();
      setIsPageLoaded(true);
    }
  };

  const onChangeLanguage = async (langId: string) => {
    dispatch({ type: ActionTypes.SET_IS_ITEM_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_LANG_ID, payload: langId });
    await getItem(langId);
    dispatch({ type: ActionTypes.SET_IS_ITEM_LOADING, payload: false });
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = [
      {
        title: t('components'),
        url: EndPoints.COMPONENT_WITH.LIST,
      },
      {
        title: t(queries._id ? 'edit' : 'add'),
      },
    ];
    if (queries._id) {
      titles.push({
        title: mainTitleRef.current,
      });
    }
    appDispatch(setBreadCrumbState(titles));
  };

  const getComponentTypes = () => {
    dispatch({
      type: ActionTypes.SET_COMPONENT_TYPES,
      payload: componentTypes.map((type) => ({
        label: t(type.langKey),
        value: type.id,
      })),
    });
  };

  const getElementTypes = () => {
    dispatch({
      type: ActionTypes.SET_ELEMENT_TYPES,
      payload: elementTypes.map((type) => ({
        label: t(type.langKey),
        value: type.id,
      })),
    });
  };

  const getItem = async (_langId?: string) => {
    _langId = _langId || state.langId;
    if (queries._id) {
      const serviceResult = await ComponentService.getWithId(
        {
          _id: queries._id,
          langId: _langId,
        },
        abortController.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const item = serviceResult.data;
        dispatch({ type: ActionTypes.SET_ITEM, payload: item });
        form.reset({
          ...item,
          elements: item.elements.map((element) => ({
            ...element,
            contents: {
              ...element.contents,
              langId: _langId,
            },
          })),
        });

        if (_langId == mainLangId) {
          mainTitleRef.current = item.title;
        }
      } else {
        await navigatePage();
      }
    }
  };

  const navigatePage = async () => {
    const path = EndPoints.COMPONENT_WITH.LIST;
    await RouteUtil.change({ path, router });
  };

  const onSubmit = async (event: FormEvent) => {
    const params = form.getValues();
    console.log('onSubmit', params);
    return;
    const serviceResult = await (params._id
      ? ComponentService.updateWithId(params, abortController.signal)
      : ComponentService.add(params, abortController.signal));

    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `${t(params._id ? 'itemEdited' : 'itemAdded')}!`,
      });
      if (!params._id) {
        await navigatePage();
      } else {
        const newItem: IComponentState['item'] = {
          ...state.item!,
          elements:
            state.item?.elements.map((element) => {
              if (
                (element.alternates?.indexOfKey('langId', state.langId) ?? -1) <
                0
              ) {
                element.alternates = [
                  ...(element.alternates ?? []),
                  {
                    langId: state.langId,
                  },
                ];
              }
              return element;
            }) ?? [],
        };
        dispatch({ type: ActionTypes.SET_ITEM, payload: newItem });
      }
    }
  };

  const onCreateElement = () => {
    const formValues = form.getValues();
    const _id = String.createId();
    const newElements = [
      ...formValues.elements,
      {
        _id: _id,
        title: '',
        rank: formValues.elements.length + 1,
        typeId: ElementTypeId.Text,
        key: '',
        contents: {
          langId: state.langId,
        },
      },
    ];
    form.setValue('elements', newElements);
    onEdit(_id);
  };

  const onAccept = async (newElement: IComponentElementModel) => {
    let newElements = form.getValues().elements;
    let foundIndex = newElements.indexOfKey('_id', state.selectedElementId);
    if (foundIndex > -1) {
      newElements[foundIndex] = newElement;
      form.setValue('elements', newElements);
    }
    return true;
  };

  const onEdit = (_id: string) => {
    dispatch({
      type: ActionTypes.SET_IS_SHOW_MODAL_EDIT_ELEMENT,
      payload: true,
    });
    dispatch({ type: ActionTypes.SET_SELECTED_ELEMENT_ID, payload: _id });
  };

  const onDelete = async (index: number) => {
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: `<b>'${form.getValues().elements[index].key}'</b> ${t('deleteItemQuestionWithItemName')}`,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      const newElements = form.getValues().elements;
      newElements.splice(index, 1);
      form.setValue('elements', newElements);
    }
  };

  const Header = () => {
    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-6 align-content-center">
            <div className="row">
              <div className="col-md-3 mb-md-0 mb-4">
                <button
                  className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
                  onClick={() => navigatePage()}
                >
                  <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <ComponentThemeContentLanguage
              onChange={(item) => onChangeLanguage(item.value._id)}
              selectedLangId={state.langId}
              showMissingMessage
              ownedLanguages={state.item?.elements.map(
                (item) => item.alternates ?? []
              )}
            />
          </div>
        </div>
      </div>
    );
  };

  const ComponentElement = (
    elementProps: IComponentElementGetResultService,
    index: number
  ) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet
          legend={`${elementProps.title} ${PermissionUtil.checkPermissionRoleRank(sessionAuth!.user.roleId, UserRoleId.SuperAdmin) ? `(#${elementProps.key})` : ''}`}
          legendElement={
            PermissionUtil.checkPermissionRoleRank(
              sessionAuth!.user.roleId,
              UserRoleId.SuperAdmin
            ) ? (
              <span>
                <i
                  className="mdi mdi-pencil-box text-warning fs-1 cursor-pointer ms-2"
                  onClick={() => onEdit(elementProps._id)}
                ></i>
                <i
                  className="mdi mdi-minus-box text-danger fs-1 cursor-pointer ms-2"
                  onClick={() => onDelete(index)}
                ></i>
              </span>
            ) : undefined
          }
        >
          <div className="row">
            <div className="col-md">
              <ComponentPageComponentElementTypeInput
                data={elementProps}
                index={index}
              />
            </div>
            {
              <ComponentThemeToolTipMissingLanguages
                itemLanguages={elementProps.alternates ?? []}
                div={true}
                divClass="col-md-1"
              />
            }
          </div>
        </ComponentFieldSet>
      </div>
    );
  };

  const TabElements = () => {
    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <div className="row">
            {form
              .getValues()
              .elements?.orderBy('rank', 'asc')
              .map((item: any, index) => ComponentElement(item, index))}
          </div>
        </div>
        {PermissionUtil.checkPermissionRoleRank(
          sessionAuth!.user.roleId,
          UserRoleId.SuperAdmin
        ) ? (
          <div
            className={`col-md-7 text-start ${form.getValues().elements.length > 0 ? 'mt-4' : ''}`}
          >
            <button
              type={'button'}
              className="btn btn-gradient-success btn-lg"
              onClick={() => onCreateElement()}
            >
              + {t('addNew')}
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  const TabGeneral = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('title')}*`}
            name="title"
            type="text"
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType title={`${t('key')}*`} name="key" type="text" />
        </div>
        <div className="col-md-7 mt-3">
          <ComponentFormSelect
            title={`${t('typeId')}*`}
            name="typeId"
            placeholder={t('typeId')}
            options={state.componentTypes}
            value={state.componentTypes.findSingle(
              'value',
              form.getValues().typeId
            )}
          />
        </div>
      </div>
    );
  };

  const selectedElement = form.getValues().elements.findSingle("_id", state.selectedElementId) as IComponentElementModel;

  return isPageLoading ? null : (
    <div className="page-post">
      <ComponentThemeModalEditComponentElement
        isShow={state.isShowModalEditElement}
        onHide={() =>
          dispatch({
            type: ActionTypes.SET_IS_SHOW_MODAL_EDIT_ELEMENT,
            payload: false,
          })
        }
        onSubmit={(newElement) => onAccept(newElement)}
        item={selectedElement}
      />
      <div className="row mb-3">
        <Header />
      </div>
      <div className="row position-relative">
        {state.isItemLoading ? (
          <ComponentSpinnerDonut customClass="page-spinner" />
        ) : null}
        <div className="col-md-12">
          <ComponentForm
            submitButtonText={t('save')}
            submitButtonSubmittingText={t('loading')}
            onSubmit={(event) => onSubmit(event)}
            formMethods={form}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="theme-tabs">
                    <Tabs
                      onSelect={(key: any) =>
                        dispatch({
                          type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
                          payload: key,
                        })
                      }
                      activeKey={state.mainTabActiveKey}
                      className="mb-5"
                      transition={false}
                    >
                      {PermissionUtil.checkPermissionRoleRank(
                        sessionAuth!.user.roleId,
                        UserRoleId.SuperAdmin
                      ) ? (
                        <Tab eventKey="general" title={t('general')}>
                          <TabGeneral />
                        </Tab>
                      ) : null}
                      <Tab eventKey="elements" title={t('elements')}>
                        <TabElements />
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </ComponentForm>
        </div>
      </div>
    </div>
  );
}
