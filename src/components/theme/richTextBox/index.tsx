import React, { useEffect, useReducer, useRef } from 'react';
import JoditEditor, { Jodit as JoditReact } from 'jodit-react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { Config } from 'jodit/types/config';
import Spinner from 'react-bootstrap/Spinner';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IJodit } from 'jodit/types/types';
import { useDidMount } from '@library/react/hooks';
import { Controller, useFormContext } from 'react-hook-form';
import { IActionWithPayload } from 'types/hooks';

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

type IComponentProps = {
  name: string;
};

const ComponentThemeRichTextBox = React.memo((props: IComponentProps) => {
  const config: Partial<Config> = {
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
        exec: (_view) => onClickChooseImage(view),
      },
    },
  };

  const form = useFormContext();

  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  const ref = useRef<JoditReact>(null);
  let view: IJodit | null = null;

  useDidMount(() => {
    init();
  });

  const init = () => {
    dispatch({ type: ActionTypes.SET_IS_LOADING, payload: false });
  };

  const onClickChooseImage = async (_view: any) => {
    view = _view;
    dispatch({ type: ActionTypes.SET_IS_GALLERY_SHOW, payload: true });
  };

  const onSelectedImage = (images: string[]) => {
    if (view) {
      for (const image of images) {
        view.selection.insertImage(ImageSourceUtil.getUploadedImageSrc(image));
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
        onSelected={(images) => onSelectedImage(images)}
        isMulti={true}
        isShow={state.isGalleryShow}
        onHideModal={() => onHideGalleryModal()}
        hideShowModalButton={true}
      />
      <React.Fragment>
        <Controller
          name={props.name || ''}
          render={({ field }) => (
            <JoditEditor
              ref={(e) => {
                field.ref(e);
                ref.current = e;
              }}
              value={field.value}
              config={config}
              onChange={(newValue) => field.onChange(newValue || '')}
            />
          )}
        />
      </React.Fragment>
    </div>
  );
});

export default ComponentThemeRichTextBox;
