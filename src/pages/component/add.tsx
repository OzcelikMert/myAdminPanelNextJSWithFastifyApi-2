import { FormEvent, use, useEffect, useReducer } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import {
  IComponentElementGetResultService,
  IComponentGetResultService,
  IComponentUpdateWithIdParamService,
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
import { useAppDispatch, useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useRouter } from 'next/router';
import { setIsPageLoadingState } from '@lib/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@lib/features/breadCrumbSlice';
import ComponentFieldSet from '@components/elements/fieldSet';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentForm from '@components/elements/form';

type IHandleInputChangeParams = {
  index: number;
  key: string;
  value: any;
  isSelectedItem?: boolean;
};

type IComponentState = {
  elementTypes: IThemeFormSelectData<ElementTypeId>[];
  componentTypes: IThemeFormSelectData<ComponentTypeId>[];
  mainTabActiveKey: string;
  isSubmitting: boolean;
  mainTitle: string;
  langId: string;
  selectedItem?: IComponentElementModel;
};

const initialState: IComponentState = {
  elementTypes: [],
  componentTypes: [],
  mainTabActiveKey: 'general',
  isSubmitting: false,
  mainTitle: '',
  langId: '',
};

type IAction =
  | { type: 'SET_ELEMENT_TYPES'; payload: IComponentState['elementTypes'] }
  | { type: 'SET_COMPONENT_TYPES'; payload: IComponentState['componentTypes'] }
  | {
      type: 'SET_MAIN_TAB_ACTIVE_KEY';
      payload: IComponentState['mainTabActiveKey'];
    }
  | { type: 'SET_IS_SUBMITTING'; payload: IComponentState['isSubmitting'] }
  | { type: 'SET_MAIN_TITLE'; payload: IComponentState['mainTitle'] }
  | { type: 'SET_LANG_ID'; payload: IComponentState['langId'] }
  | { type: 'SET_SELECTED_ITEM'; payload: IComponentState['selectedItem'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_ELEMENT_TYPES':
      return { ...state, elementTypes: action.payload };
    case 'SET_COMPONENT_TYPES':
      return { ...state, componentTypes: action.payload };
    case 'SET_MAIN_TAB_ACTIVE_KEY':
      return { ...state, mainTabActiveKey: action.payload };
    case 'SET_IS_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_MAIN_TITLE':
      return { ...state, mainTitle: action.payload };
    case 'SET_LANG_ID':
      return { ...state, langId: action.payload };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    default:
      return state;
  }
}

type IComponentFormState = IComponentUpdateWithIdParamService;

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
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer<IComponentFormState>({
      ...initialFormState,
      _id: queries._id ?? '',
    });

  useEffect(() => {
    init();
    return () => {
      abortController.abort();
    };
  }, []);

  const init = async () => {
    const minPermission = formState._id
      ? ComponentEndPointPermission.UPDATE
      : ComponentEndPointPermission.ADD;
    if (
      PermissionUtil.checkAndRedirect({
        appDispatch,
        minPermission,
        router,
        sessionAuth,
        t,
      })
    ) {
      getElementTypes();
      getComponentTypes();
      if (formState._id) {
        await getItem();
      }
      setPageTitle();
      appDispatch(setIsPageLoadingState(false));
    }
  };

  const changeLanguage = async (langId: string) => {
    appDispatch(setIsPageLoadingState(true));
    await getItem(langId);
    appDispatch(setIsPageLoadingState(false));
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = [
      {
        title: t('components'),
        url: EndPoints.COMPONENT_WITH.LIST,
      },
      {
        title: t(formState._id ? 'edit' : 'add'),
      },
    ];
    if (formState._id) {
      titles.push({
        title: state.mainTitle,
      });
    }
    appDispatch(setBreadCrumbState(titles));
  };

  const getComponentTypes = () => {
    dispatch({
      type: 'SET_COMPONENT_TYPES',
      payload: componentTypes.map((type) => ({
        label: t(type.langKey),
        value: type.id,
      })),
    });
  };

  const getElementTypes = () => {
    dispatch({
      type: 'SET_ELEMENT_TYPES',
      payload: elementTypes.map((type) => ({
        label: t(type.langKey),
        value: type.id,
      })),
    });
  };

  const getItem = async (langId?: string) => {
    langId = langId || mainLangId;
    if (formState._id) {
      const serviceResult = await ComponentService.getWithId(
        {
          _id: formState._id,
          langId: langId,
        },
        abortController.signal
      );
      if (serviceResult.status && serviceResult.data) {
        const item = serviceResult.data;
        setFormState({
          ...item,
          elements: item.elements.map((element) => ({
            ...element,
            contents: {
              ...element.contents,
              langId: langId,
            },
          })),
        });

        if (langId == mainLangId) {
          dispatch({ type: 'SET_MAIN_TITLE', payload: item.title });
        }
      } else {
        await navigatePage();
      }
    }
  };

  const navigatePage = async () => {
    const path = EndPoints.COMPONENT_WITH.LIST;
    await RouteUtil.change({ appDispatch, path, router });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: 'SET_IS_SUBMITTING', payload: true });
    const params = formState;
    const serviceResult = await (params._id
      ? ComponentService.updateWithId(params, abortController.signal)
      : ComponentService.add(params, abortController.signal));

    dispatch({ type: 'SET_IS_SUBMITTING', payload: false });

    if (serviceResult.status) {
      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `${t(params._id ? 'itemEdited' : 'itemAdded')}!`,
      });
      if (!params._id) {
        await navigatePage();
      }
    }
  };

  const handleInputChange = (params: IHandleInputChangeParams) => {
    if (params.isSelectedItem) {
      let newSelectedItem = state.selectedItem as any;
      newSelectedItem[params.key] = params.value;
      dispatch({ type: 'SET_SELECTED_ITEM', payload: newSelectedItem });
    } else {
      let newElements = formState.elements as any;
      newElements[params.index][params.key] = params.value;
      setFormState({
        elements: newElements,
      });
    }
  };

  const onCreateElement = () => {
    const _id = String.createId();
    setFormState({
      elements: [
        ...formState.elements,
        {
          _id: _id,
          title: '',
          rank: formState.elements.length + 1,
          typeId: ElementTypeId.Text,
          key: '',
          contents: {
            langId: mainLangId,
          },
        },
      ],
    });
    onEdit(formState.elements.indexOfKey('_id', _id));
  };

  const onAccept = (index: number) => {
    let newElements = formState.elements;
    newElements[index] = state.selectedItem!;
    setFormState({
      elements: newElements,
    });
    onCancelEdit();
  };

  const onEdit = (index: number) => {
    dispatch({
      type: 'SET_SELECTED_ITEM',
      payload: cloneDeepWith(formState.elements[index]),
    });
  };

  const onCancelEdit = () => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: undefined });
  };

  const onDelete = async (index: number) => {
    const result = await Swal.fire({
      title: t('deleteAction'),
      html: `<b>'${formState.elements[index].key}'</b> ${t('deleteItemQuestionWithItemName')}`,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      icon: 'question',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      const newElements = formState.elements;
      newElements.splice(index, 1);
      setFormState({
        elements: newElements,
      });
    }
  };

  const Header = () => {
    return (
      <div className="col-md-3">
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
              onClick={() => navigatePage()}
            >
              <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
            </button>
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
                  onClick={() => onEdit(index)}
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
                onChange={(key, value) =>
                  handleInputChange({ index, key, value })
                }
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

  const ComponentElementEdit = (
    elementProps: IComponentElementGetResultService,
    index: number
  ) => {
    return (
      <div className={`col-md-12 ${index > 0 ? 'mt-5' : ''}`}>
        <ComponentFieldSet legend={t('newElement')}>
          <div className="row mt-3">
            <div className="col-md-12">
              <ComponentFormType
                title={`${t('title')}*`}
                placeholder={t('title')}
                type="text"
                value={elementProps.title}
                onChange={(e) =>
                  handleInputChange({
                    index,
                    key: 'title',
                    value: e.target.value,
                    isSelectedItem: true,
                  })
                }
              />
            </div>
            <div className="col-md-12 mt-3">
              <ComponentFormType
                title={`${t('key')}*`}
                type="text"
                value={elementProps.key}
                onChange={(e) =>
                  handleInputChange({
                    index,
                    key: 'key',
                    value: e.target.value,
                    isSelectedItem: true,
                  })
                }
              />
            </div>
            <div className="col-md-12 mt-3">
              <ComponentFormSelect
                title={t('typeId')}
                placeholder={t('typeId')}
                options={state.elementTypes}
                value={state.elementTypes.filter(
                  (item) => item.value == elementProps.typeId
                )}
                onChange={(item: any, e) =>
                  handleInputChange({
                    index,
                    key: 'typeId',
                    value: item.value,
                    isSelectedItem: true,
                  })
                }
              />
            </div>
            <div className="col-md-12 mt-3">
              <ComponentFormType
                title={`${t('rank')}*`}
                type="number"
                required={true}
                value={elementProps.rank}
                onChange={(e) =>
                  handleInputChange({
                    index,
                    key: 'rank',
                    value: Number(e.target.value) || 0,
                    isSelectedItem: true,
                  })
                }
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

  const TabElements = () => {
    return (
      <div className="row mb-3">
        <div className="col-md-7">
          <div className="row">
            {formState.elements
              ?.orderBy('rank', 'asc')
              .map((item, index) =>
                state.selectedItem && state.selectedItem._id == item._id
                  ? ComponentElementEdit(state.selectedItem, index)
                  : ComponentElement(item, index)
              )}
          </div>
        </div>
        {PermissionUtil.checkPermissionRoleRank(
          sessionAuth!.user.roleId,
          UserRoleId.SuperAdmin
        ) ? (
          <div
            className={`col-md-7 text-start ${formState.elements.length > 0 ? 'mt-4' : ''}`}
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
            required={true}
            value={formState.title}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('key')}*`}
            name="key"
            type="text"
            required={true}
            value={formState.key}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mt-3">
          <ComponentFormSelect
            title={`${t('typeId')}*`}
            name='typeId'
            placeholder={t('typeId')}
            options={state.componentTypes}
            value={state.componentTypes.findSingle('value', formState.typeId)}
            onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
          />
        </div>
      </div>
    );
  };

  return isPageLoading ? null : (
    <div className="page-post">
      <div className="row mb-3">
        <Header />
      </div>
      <div className="row">
        <div className="col-md-12">
          <ComponentForm
            isActiveSaveButton={true}
            saveButtonText={t('save')}
            saveButtonLoadingText={t('loading')}
            isSubmitting={state.isSubmitting}
            formAttributes={{ onSubmit: (event) => onSubmit(event) }}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="theme-tabs">
                    <Tabs
                      onSelect={(key: any) =>
                        dispatch({
                          type: 'SET_MAIN_TAB_ACTIVE_KEY',
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
