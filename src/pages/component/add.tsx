import React, { useReducer, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { IComponentInputSelectData } from '@components/elements/inputs/select';
import {
  IComponentGetResultService,
  IComponentUpdateWithIdParamService,
} from 'types/services/component.service';
import { IComponentElementModel } from 'types/models/component.model';
import { PermissionUtil } from '@utils/permission.util';
import { ComponentEndPointPermission } from '@constants/endPointPermissions/component.endPoint.permission';
import { ElementTypeId, elementTypes } from '@constants/elementTypes';
import { ComponentService } from '@services/component.service';
import { EndPoints } from '@constants/endPoints';
import { UserRoleId } from '@constants/userRoles';
import { ComponentTypeId, componentTypes } from '@constants/componentTypes';
import { RouteUtil } from '@utils/route.util';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useRouter } from 'next/router';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentThemeForm from '@components/theme/form';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentSchema } from 'schemas/component.schema';
import ComponentPageComponentAddElementEditModal from '@components/pages/component/add/editElementModal';
import ComponentPageComponentAddTabGeneral from '@components/pages/component/add/tabGeneral';
import ComponentPageComponentAddTabElements from '@components/pages/component/add/tabElements';
import ComponentPageComponentAddHeader from '@components/pages/component/add/header';
import { SelectUtil } from '@utils/select.util';
import { IActionWithPayload } from 'types/hooks';
import { useToast } from 'hooks/toast';
import ComponentThemeTabs from '@components/theme/tabs';
import ComponentThemeTab from '@components/theme/tabs/tab';

export type IPageComponentAddState = {
  elementTypes: IComponentInputSelectData<ElementTypeId>[];
  componentTypes: IComponentInputSelectData<ComponentTypeId>[];
  mainTabActiveKey: string;
  isItemLoading: boolean;
  item?: IComponentGetResultService;
  langId: string;
  isShowModalEditElement: boolean;
  selectedElementId: string;
};

const initialState: IPageComponentAddState = {
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
  | IActionWithPayload<
      ActionTypes.SET_ELEMENT_TYPES,
      IPageComponentAddState['elementTypes']
    >
  | IActionWithPayload<
      ActionTypes.SET_COMPONENT_TYPES,
      IPageComponentAddState['componentTypes']
    >
  | IActionWithPayload<
      ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
      IPageComponentAddState['mainTabActiveKey']
    >
  | IActionWithPayload<
      ActionTypes.SET_IS_ITEM_LOADING,
      IPageComponentAddState['isItemLoading']
    >
  | IActionWithPayload<ActionTypes.SET_ITEM, IPageComponentAddState['item']>
  | IActionWithPayload<
      ActionTypes.SET_LANG_ID,
      IPageComponentAddState['langId']
    >
  | IActionWithPayload<
      ActionTypes.SET_IS_SHOW_MODAL_EDIT_ELEMENT,
      IPageComponentAddState['isShowModalEditElement']
    >
  | IActionWithPayload<
      ActionTypes.SET_SELECTED_ELEMENT_ID,
      IPageComponentAddState['selectedElementId']
    >;

const reducer = (
  state: IPageComponentAddState,
  action: IAction
): IPageComponentAddState => {
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

export type IPageFormState = IComponentUpdateWithIdParamService;

const initialFormState: IPageFormState = {
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
  const abortControllerRef = React.useRef(new AbortController());

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
    componentTypes: SelectUtil.getComponentTypes(t),
    elementTypes: SelectUtil.getElementTypes(t),
  });
  const form = useForm<IPageFormState>({
    defaultValues: {
      ...initialFormState,
      _id: queries._id ?? '',
    },
    resolver: zodResolver(
      queries._id ? ComponentSchema.putWithId : ComponentSchema.post
    ),
  });
  const { showToast } = useToast();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const mainTitleRef = useRef<string>('');

  useDidMount(() => {
    init();
    return () => {
      abortControllerRef.current.abort();
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
      await PermissionUtil.checkAndRedirect({
        minPermission,
        router,
        sessionAuth,
        t,
        showToast,
      })
    ) {
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

  const getItem = async (_langId?: string) => {
    _langId = _langId || state.langId;
    if (queries._id) {
      const serviceResult = await ComponentService.getWithId(
        {
          _id: queries._id,
          langId: _langId,
        },
        abortControllerRef.current.signal
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

  const onSubmit = async (data: IPageFormState) => {
    const params = data;
    const serviceResult = await (params._id
      ? ComponentService.updateWithId(params, abortControllerRef.current.signal)
      : ComponentService.add(params, abortControllerRef.current.signal));

    if (serviceResult.status) {
      showToast({
        type: 'success',
        title: t('successful'),
        content: `${t(params._id ? 'itemEdited' : 'itemAdded')}!`,
      });
      if (!params._id) {
        await navigatePage();
      } else {
        const newItem: IPageComponentAddState['item'] = {
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
    form.trigger(`elements`);
    onEdit(_id);
  };

  const onAccept = async (newElement: IComponentElementModel) => {
    const newElements = form.getValues().elements;
    const foundIndex = newElements.indexOfKey('_id', state.selectedElementId);
    if (foundIndex > -1) {
      form.setValue(`elements.${foundIndex}`, newElement);
      form.trigger(`elements.${foundIndex}`);
      return true;
    }
    return false;
  };

  const onEdit = (_id: string) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ELEMENT_ID, payload: _id });
    dispatch({
      type: ActionTypes.SET_IS_SHOW_MODAL_EDIT_ELEMENT,
      payload: true,
    });
  };

  const onDelete = async (_id: string) => {
    const newElements = form.getValues().elements;
    const index = newElements.indexOfKey('_id', _id);
    if (index > -1) {
      const result = await Swal.fire({
        title: t('deleteAction'),
        html: t('deleteItemQuestionWithItemName', [newElements[index].key]),
        confirmButtonText: t('yes'),
        cancelButtonText: t('no'),
        icon: 'question',
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        newElements.splice(index, 1);
        form.setValue('elements', newElements);
        form.trigger(`elements`);
      }
    }
  };

  const formValues = form.getValues();
  const selectedElement = formValues.elements.findSingle(
    '_id',
    state.selectedElementId
  );

  return isPageLoading ? null : (
    <div className="page-post">
      <ComponentPageComponentAddElementEditModal
        elementTypes={state.elementTypes}
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
        <ComponentPageComponentAddHeader
          item={state.item}
          langId={state.langId}
          showLanguageSelector={formValues._id ? true : false}
          onChangeLanguage={(_id) => onChangeLanguage(_id)}
          onNavigatePage={() => navigatePage()}
        />
      </div>
      <div className="row position-relative">
        {state.isItemLoading ? (
          <ComponentSpinnerDonut customClass="page-spinner" />
        ) : null}
        <div className="col-md-12">
          <ComponentThemeForm
            formMethods={form}
            onSubmit={(data) => onSubmit(data)}
          >
            <div className="grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <ComponentThemeTabs
                    onSelect={(key: any) =>
                      dispatch({
                        type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY,
                        payload: key,
                      })
                    }
                    activeKey={state.mainTabActiveKey}
                  >
                    {PermissionUtil.checkPermissionRoleRank(
                      sessionAuth!.user.roleId,
                      UserRoleId.SuperAdmin
                    ) ? (
                      <ComponentThemeTab
                        eventKey="general"
                        title={t('general')}
                        formFieldErrorKeys={['title', 'key']}
                      >
                        <ComponentPageComponentAddTabGeneral
                          componentTypes={state.componentTypes}
                          typeId={formValues.typeId}
                        />
                      </ComponentThemeTab>
                    ) : null}
                    <ComponentThemeTab
                      eventKey="elements"
                      title={t('elements')}
                      formFieldErrorKeys={['elements']}
                    >
                      <ComponentPageComponentAddTabElements
                        elements={formValues.elements}
                        onCreateNewElement={() => onCreateElement()}
                        onDelete={(_id) => onDelete(_id)}
                        onEdit={(_id) => onEdit(_id)}
                      />
                    </ComponentThemeTab>
                  </ComponentThemeTabs>
                </div>
              </div>
            </div>
          </ComponentThemeForm>
        </div>
      </div>
    </div>
  );
}
