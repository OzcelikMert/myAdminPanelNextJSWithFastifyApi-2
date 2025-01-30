import React, { useReducer } from 'react';
import JoditEditor, {
  IJoditEditorProps,
  Jodit as JoditReact,
} from 'jodit-react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { Config } from 'jodit/types/config';
import Spinner from 'react-bootstrap/Spinner';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IJodit, IViewBased, IViewOptions } from 'jodit/types/types';
import { useDidMount } from '@library/react/hooks';
import { IActionWithPayload } from 'types/hooks';
import { GSP_NO_RETURNED_VALUE } from 'next/dist/lib/constants';

type IComponentState = {
  value: string;
  isGalleryShow: boolean;
  isLoading: boolean;
};

const initialState: IComponentState = {
  value: '',
  isGalleryShow: false,
  isLoading: true,
};

enum ActionTypes {
  SET_VALUE,
  SET_IS_GALLERY_SHOW,
  SET_IS_LOADING,
}

type IAction =
  | IActionWithPayload<ActionTypes.SET_VALUE, IComponentState['value']>
  | IActionWithPayload<
      ActionTypes.SET_IS_GALLERY_SHOW,
      IComponentState['isGalleryShow']
    >
  | IActionWithPayload<
      ActionTypes.SET_IS_LOADING,
      IComponentState['isLoading']
    >;

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case ActionTypes.SET_VALUE:
      return { ...state, value: action.payload };
    case ActionTypes.SET_IS_GALLERY_SHOW:
      return { ...state, isGalleryShow: action.payload };
    case ActionTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

type IComponentProps = {} & Omit<IJoditEditorProps, 'config' | 'onBlur'>;

const ComponentInputRichTextbox = React.memo(
  React.forwardRef<JoditReact, IComponentProps>((props, ref) => {
    const configRef = React.useRef<Partial<Config>>({
      extraIcons: {
        gallery: `<i class="mdi mdi-folder-multiple-image"></i>`,
      },
      useNativeTooltip: false,
      safeMode: false,
      activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
      toolbarButtonSize: 'middle',
      theme: 'default',
      editorClassName: 'rich-text-box',
      triggerChangeEvent: true,
      editHTMLDocumentMode: true,
      defaultActionOnPaste: 'insert_clear_html',
      width: 'auto',
      height: '550px',
      direction: 'ltr',
      language: 'auto',
      toolbar: true,
      enter: 'p',
      useSplitMode: false,
      colorPickerDefaultTab: 'color',
      imageDefaultWidth: 300,
      removeButtons: [],
      disablePlugins: [],
      extraButtons: [{ name: 'chooseImage' }],
      controls: {
        chooseImage: {
          name: 'chooseImage',
          icon: 'gallery',
          text: 'Gallery Images',
          tooltip: 'Choose a image in gallery',
          exec: (_view) => onClickChooseImage(_view as IJodit),
        },
      },
    });
    const viewRef = React.useRef<IJodit>(null);

    const [state, dispatch] = useReducer(reducer, {
      ...initialState,
    });

    useDidMount(() => {
      init();
    });

    const init = () => {
      dispatch({ type: ActionTypes.SET_IS_LOADING, payload: false });
    };

    const onClickChooseImage = async (_view: IJodit) => {
      viewRef.current = _view;
      dispatch({ type: ActionTypes.SET_IS_GALLERY_SHOW, payload: true });
    };

    const onSelectedImage = (images: string[]) => {
      if (viewRef.current) {
        for (const image of images) {
          viewRef.current.s.insertImage(
            ImageSourceUtil.getUploadedImageSrc(image)
          );
        }
      }
    };

    const onHideGalleryModal = () => {
      dispatch({ type: ActionTypes.SET_IS_GALLERY_SHOW, payload: false });
    };

    return state.isLoading ? (
      <Spinner animation="border" />
    ) : (
      <div id={`themeRichTextBox_${String.createId()}`}>
        <ComponentThemeChooseImage
          isMulti={true}
          isShow={state.isGalleryShow}
          hideShowModalButton
          hideReviewImage
          onChange={(images) => onSelectedImage(images)}
          onHideModal={() => onHideGalleryModal()}
        />
        <React.Fragment>
          {
            // @ts-ignore
            <JoditEditor
              value={props.value}
              className={props.className}
              ref={ref}
              config={configRef.current}
              onBlur={(newValue) => props.onChange && props.onChange(newValue)}
            />
          }
        </React.Fragment>
      </div>
    );
  })
);

export default ComponentInputRichTextbox;
