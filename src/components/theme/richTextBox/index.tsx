import React, { useEffect, useReducer, useRef } from 'react';
import JoditEditor, { Jodit as JoditReact } from 'jodit-react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { Config } from 'jodit/types/config';
import Spinner from 'react-bootstrap/Spinner';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IJodit } from 'jodit/types/types';

type IComponentState = {
  value: string;
  isGalleryShow: boolean;
  isLoading: boolean;
};

const initialState: IComponentState = { value: '', isGalleryShow: false, isLoading: true };


type IAction =
  | { type: 'SET_VALUE'; payload: IComponentState['value'] }
  | { type: 'SET_IS_GALLERY_SHOW'; payload: IComponentState['isGalleryShow'] }
  | { type: 'SET_IS_LOADING'; payload: IComponentState['isLoading'] };

const reducer = (state: IComponentState, action: IAction): IComponentState => {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, value: action.payload };
    case 'SET_IS_GALLERY_SHOW':
      return { ...state, isGalleryShow: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

type IComponentProps = {
  value: string;
  onChange: (newContent: string) => void;
};

export default function ComponentThemeRichTextBox(props: IComponentProps) {
  const config: Partial<Config> = {
    extraIcons: {
      gallery: `<i class="mdi mdi-folder-multiple-image"></i>`,
    },
    useNativeTooltip: false,
    safeMode: false,
    activeButtonsInReadOnly: [
      'source',
      'fullsize',
      'print',
      'about',
      'dots',
    ],
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

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    value: props.value || initialState.value
  });

  const ref = useRef<JoditReact>(null);
  let view: IJodit | null = null;

  useEffect(() => {
    dispatch({ type: 'SET_IS_LOADING', payload: false });
  }, []);

  const onClickChooseImage = async (_view: any) => {
    view = _view;
    dispatch({ type: 'SET_IS_GALLERY_SHOW', payload: true });
  }

  const onSelectedImage = (images: string[]) => {
    if (view) {
      for (const image of images) {
        view.selection.insertImage(
          ImageSourceUtil.getUploadedImageSrc(image)
        );
      }
    }
  }

  const onHideGalleryModal = () => {
    dispatch({ type: 'SET_IS_GALLERY_SHOW', payload: false });
  }

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
        {
          // @ts-ignore
          <JoditEditor
            ref={ref}
            value={state.value}
            config={config}
            onBlur={(newContent) =>
              props.onChange(ref.current?.value || '')
            }
          />
        }
      </React.Fragment>
    </div>
  );
}