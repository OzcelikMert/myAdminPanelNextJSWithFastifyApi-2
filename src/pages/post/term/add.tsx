import { FormEvent, useEffect, useReducer, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { PostTermService } from '@services/postTerm.service';
import {
  IPostTermGetResultService,
  IPostTermUpdateWithIdParamService,
} from 'types/services/postTerm.service';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import { PostTypeId } from '@constants/postTypes';
import { PostTermTypeId } from '@constants/postTermTypes';
import { PermissionUtil, PostPermissionMethod } from '@utils/permission.util';
import { PostUtil } from '@utils/post.util';
import { StatusId } from '@constants/status';
import { ComponentUtil } from '@utils/component.util';
import { RouteUtil } from '@utils/route.util';
import ComponentToast from '@components/elements/toast';
import ComponentToolTip from '@components/elements/tooltip';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useFormReducer } from '@library/react/handles/form';
import {
  IBreadCrumbData,
  setBreadCrumbState,
} from '@redux/features/breadCrumbSlice';
import ComponentFormType from '@components/elements/form/input/type';
import ComponentForm from '@components/elements/form';
import { setIsPageLoadingState } from '@redux/features/pageSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/customHooks';

type IComponentState = {
  mainTabActiveKey: string;
  items: IThemeFormSelectData<string>[];
  status: IThemeFormSelectData[];
  mainTitle: string;
  langId: string;
  item?: IPostTermGetResultService;
};

const initialState: IComponentState = {
  mainTabActiveKey: 'general',
  items: [],
  status: [],
  mainTitle: '',
  langId: '',
};

enum ActionTypes {
  SET_MAIN_TAB_ACTIVE_KEY,
  SET_ITEMS,
  SET_STATUS,
  SET_MAIN_TITLE,
  SET_LANG_ID,
  SET_ITEM,
}

type IAction =
  | {
      type: ActionTypes.SET_MAIN_TAB_ACTIVE_KEY;
      payload: IComponentState['mainTabActiveKey'];
    }
  | { type: ActionTypes.SET_ITEMS; payload: IComponentState['items'] }
  | { type: ActionTypes.SET_STATUS; payload: IComponentState['status'] }
  | { type: ActionTypes.SET_MAIN_TITLE; payload: IComponentState['mainTitle'] }
  | { type: ActionTypes.SET_LANG_ID; payload: IComponentState['langId'] }
  | { type: ActionTypes.SET_ITEM; payload: IComponentState['item'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_MAIN_TAB_ACTIVE_KEY:
      return { ...state, mainTabActiveKey: action.payload };
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    case ActionTypes.SET_MAIN_TITLE:
      return { ...state, mainTitle: action.payload };
    case ActionTypes.SET_LANG_ID:
      return { ...state, langId: action.payload };
    case ActionTypes.SET_ITEM:
      return { ...state, item: action.payload };
    default:
      return state;
  }
};

type IComponentFormState = IPostTermUpdateWithIdParamService;

const initialFormState: IComponentFormState = {
  _id: '',
  typeId: PostTermTypeId.Category,
  postTypeId: PostTypeId.Blog,
  parentId: '',
  statusId: StatusId.Active,
  rank: 0,
  contents: {
    langId: '',
    image: '',
    title: '',
    url: '',
  },
};

type IComponentProps = {
  isModal?: boolean;
  _id?: string;
  postTypeId?: PostTypeId;
  typeId?: PostTermTypeId;
};

type IPageQueries = {
  _id?: string;
  termTypeId?: PostTermTypeId;
  postTypeId?: PostTypeId;
};

export default function PagePostTermAdd(props: IComponentProps) {
  const abortController = new AbortController();

  const router = useRouter();
  const t = useAppSelector(selectTranslation);
  const appDispatch = useAppDispatch();
  const isPageLoading = useAppSelector((state) => state.pageState.isLoading);
  const sessionAuth = useAppSelector((state) => state.sessionState.auth);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const queries = router.query as IPageQueries;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    langId: mainLangId,
  });
  const { formState, setFormState, onChangeInput, onChangeSelect } =
    useFormReducer<IComponentFormState>({
      ...initialFormState,
      typeId: queries.termTypeId ?? props.typeId ?? PostTermTypeId.Category,
      postTypeId: queries.postTypeId ?? props.postTypeId ?? PostTypeId.Blog,
      _id: queries._id ?? props._id ?? '',
    });
  const [isPageLoaded, setIsPageLoaded] = useState(false);

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
    const methodType = formState._id
      ? PostPermissionMethod.UPDATE
      : PostPermissionMethod.ADD;

    const minPermission = PermissionUtil.getPostPermission(
      formState.postTypeId,
      methodType
    );

    if (
      PermissionUtil.checkAndRedirect({
        appDispatch,
        minPermission,
        router,
        sessionAuth,
        t,
      })
    ) {
      if (
        [PostTermTypeId.Category, PostTermTypeId.Variations].includes(
          formState.typeId
        )
      ) {
        await getItems();
      }
      getStatus();
      if (formState._id) {
        await getItem();
      }
      if (!props.isModal) {
        setPageTitle();
      }
      setIsPageLoaded(true);
    }
  };

  const changeLanguage = async (langId: string) => {
    setIsPageLoaded(false);
    appDispatch(setIsPageLoadingState(true));
    await getItem(langId);
    setIsPageLoaded(true);
  };

  const setPageTitle = () => {
    const titles: IBreadCrumbData[] = PostUtil.getPageTitles({
      t: t,
      postTypeId: formState.postTypeId,
      termTypeId: formState.typeId,
    });

    if (formState._id) {
      titles.push({ title: 'edit' });
      titles.push({ title: state.mainTitle });
    } else {
      titles.push({ title: 'add' });
    }

    appDispatch(setBreadCrumbState(titles));
  };

  const getStatus = () => {
    dispatch({
      type: ActionTypes.SET_STATUS,
      payload: ComponentUtil.getStatusForSelect(
        [StatusId.Active, StatusId.InProgress],
        t
      ),
    });
  };

  const getItems = async () => {
    const typeId =
      formState.typeId == PostTermTypeId.Variations
        ? PostTermTypeId.Attributes
        : formState.typeId;

    const serviceResult = await PostTermService.getMany(
      {
        typeId: [typeId],
        postTypeId: formState.postTypeId,
        langId: mainLangId,
        statusId: StatusId.Active,
        ignoreTermId: state.items.map((item) => item.value),
      },
      abortController.signal
    );
    if (serviceResult.status && serviceResult.data) {
      const newItems: IComponentState['items'] = [
        { value: '', label: t('notSelected') },
      ];
      if (state.items.length) {
        newItems.push(...state.items);
      }
      for (const item of serviceResult.data) {
        if (item._id === formState._id) continue;
        newItems.push({
          value: item._id,
          label: item.contents?.title || t('[noLangAdd]'),
        });
      }
      dispatch({ type: ActionTypes.SET_ITEMS, payload: newItems });
    }
  };

  const getItem = async (_langId?: string) => {
    _langId = _langId || state.langId;
    const serviceResult = await PostTermService.getWithId(
      {
        _id: formState._id,
        typeId: formState.typeId,
        postTypeId: formState.postTypeId,
        langId: _langId,
      },
      abortController.signal
    );

    if (serviceResult.status && serviceResult.data) {
      const item = serviceResult.data;
      dispatch({ type: ActionTypes.SET_ITEM, payload: item });
      setFormState({
        ...item,
        parentId: item.parentId?._id || '',
        contents: {
          ...item.contents,
          langId: _langId,
        },
      });
      if (_langId == mainLangId) {
        dispatch({
          type: ActionTypes.SET_MAIN_TITLE,
          payload: item.contents?.title || '',
        });
      }
    } else {
      await navigatePage();
    }
  };

  const navigatePage = async () => {
    const postTypeId = formState.postTypeId;
    const postTermTypeId = formState.typeId;
    const pagePath = PostUtil.getPagePath(postTypeId);
    const path = pagePath.TERM_WITH(postTermTypeId).LIST;
    RouteUtil.change({ router, path });
  };

  const onSubmit = async (event: FormEvent) => {
    const params = formState;
    const serviceResult = await (formState._id
      ? PostTermService.updateWithId(params, abortController.signal)
      : PostTermService.add(params, abortController.signal));

    if (serviceResult.status) {
      if (formState.typeId == PostTermTypeId.Category) {
        await getItems();
      }

      setFormState({
        ...initialFormState,
        typeId: formState.typeId,
        postTypeId: formState.postTypeId,
        _id: formState._id,
      });

      new ComponentToast({
        type: 'success',
        title: t('successful'),
        content: `${t(formState._id ? 'itemEdited' : 'itemAdded')}!`,
      });

      if (formState._id) {
        await navigatePage();
      }
    }
  };

  const getSelectMainInputTitle = () => {
    let title = t('main');

    switch (formState.typeId) {
      case PostTermTypeId.Category:
        title = `${t('main')} ${t('category')}`;
        break;
      case PostTermTypeId.Variations:
        title = `${t('attribute')}`;
        break;
    }

    return title;
  };

  const TotalViews = () => {
    return (
      <div className="col-6">
        <ComponentToolTip message={t('views')}>
          <label className="badge badge-gradient-primary w-100 p-2 fs-6 rounded-3">
            <i className="mdi mdi-eye"></i> {formState.contents.views || 0}
          </label>
        </ComponentToolTip>
      </div>
    );
  };

  const Header = () => {
    return (
      <div className="col-md-3">
        <div className="row">
          <div className="col-6">
            {!props.isModal ? (
              <button
                className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
                onClick={() => navigatePage()}
              >
                <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
              </button>
            ) : null}
          </div>
          <TotalViews />
        </div>
      </div>
    );
  };

  const TabOptions = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('status')}
            name="statusId"
            options={state.status}
            value={state.status?.findSingle('value', formState.statusId)}
            onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('rank')}
            name="rank"
            type="number"
            required={true}
            value={formState.rank}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
      </div>
    );
  };

  const TabGeneral = () => {
    return (
      <div className="row">
        <div className="col-md-7 mb-3">
          <ComponentThemeChooseImage
            {...props}
            onSelected={(images) =>
              setFormState({
                contents: {
                  ...formState.contents,
                  image: images[0],
                },
              })
            }
            isMulti={false}
            selectedImages={
              formState.contents.image ? [formState.contents.image] : undefined
            }
            isShowReviewImage={true}
            reviewImage={formState.contents.image}
            reviewImageClassName={'post-image'}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={`${t('title')}*`}
            name="contents.title"
            type="text"
            required={true}
            value={formState.contents.title}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        <div className="col-md-7 mb-3">
          <ComponentFormType
            title={t('shortContent').toCapitalizeCase()}
            name="contents.shortContent"
            type="textarea"
            value={formState.contents.shortContent}
            onChange={(e) => onChangeInput(e)}
          />
        </div>
        {[PostTermTypeId.Category, PostTermTypeId.Variations].includes(
          Number(formState.typeId)
        ) ? (
          <div className="col-md-7 mb-3">
            <ComponentFormSelect
              title={getSelectMainInputTitle()}
              name="parentId"
              placeholder={t('chooseMainCategory')}
              options={state.items}
              value={state.items.findSingle('value', formState.parentId || '')}
              onChange={(item: any, e) => onChangeSelect(e.name, item.value)}
            />
          </div>
        ) : null}
      </div>
    );
  };

  return isPageLoading ? null : (
    <div className="page-post-term">
      <div className="row mb-3">
        <Header />
      </div>
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
                      <Tab eventKey="general" title={t('general')}>
                        <TabGeneral />
                      </Tab>
                      <Tab eventKey="options" title={t('options')}>
                        <TabOptions />
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
