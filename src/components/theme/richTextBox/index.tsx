import React, { useEffect, useRef } from 'react';
import JoditEditor, { Jodit as JoditReact } from 'jodit-react';
import ComponentThemeChooseImage from '@components/theme/chooseImage';
import { Config } from 'jodit/types/config';
import Spinner from 'react-bootstrap/Spinner';
import { ImageSourceUtil } from '@utils/imageSource.util';
import { IJodit } from 'jodit/types/types';

type IComponentState = {
  value: string;
  config: Partial<Config>;
  isGalleryShow: boolean;
  isLoading: boolean;
};

const initialState: IComponentState = { value: '', config: {}, isGalleryShow: false, isLoading: true };

type IComponentProps = {
  value: string;
  onChange: (newContent: string) => void;
};

export default function ComponentThemeRichTextBox(props: IComponentProps) {
  const initialConfigState: IComponentState["config"] = {
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
  const [value, setValue] = React.useState(props.value || initialState.value);
  const [config, setConfig] = React.useState(initialConfigState);
  const [isGalleryShow, setIsGalleryShow] = React.useState(initialState.isGalleryShow);
  const [isLoading, setIsLoading] = React.useState(initialState.isLoading);

  const ref = useRef<JoditReact>(null);
  let view: IJodit | null = null;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const onClickChooseImage = async (_view: any) => {
    view = _view;
    setIsGalleryShow(true);
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
    setIsGalleryShow(false);
  }

  return isLoading ? (
    <Spinner animation="border" />
  ) : (
    <div id={`themeRichTextBox_${String.createId()}`}>
      <ComponentThemeChooseImage
        onSelected={(images) => onSelectedImage(images)}
        isMulti={true}
        isShow={isGalleryShow}
        onHideModal={() => onHideGalleryModal()}
        hideShowModalButton={true}
      />
      <React.Fragment>
        {
          // @ts-ignore
          <JoditEditor
            ref={ref}
            value={value}
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