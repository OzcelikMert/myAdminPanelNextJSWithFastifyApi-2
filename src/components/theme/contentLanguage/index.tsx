import React from 'react';
import Image from 'next/image';
import { IThemeFormSelectData } from '@components/elements/form/input/select';
import { PathUtil } from '@utils/path.util';
import { ILanguageGetResultService } from 'types/services/language.service';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentToolTip from '@components/elements/tooltip';
import Select from 'react-select';
import { ILanguageModel } from 'types/models/language.model';
import { useEffectAfterDidMount } from '@library/react/customHooks';

type IOwnedLanguage = {
  langId: string;
};

type IComponentProps = {
  selectedLangId: string;
  onChange: (item: IThemeFormSelectData<ILanguageGetResultService>) => void;
  ownedLanguages?: IOwnedLanguage[] | IOwnedLanguage[][];
  showMissingMessage?: boolean;
};

const ComponentThemeLanguageSelector = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const languages = useAppSelector((state) => state.settingState.languages);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);
  const selectedLanguageRef = React.useRef<ILanguageModel>(
    languages.findSingle('_id', props.selectedLangId) ??
      languages.findSingle('_id', mainLangId)
  );

  useEffectAfterDidMount(() => {
    selectedLanguageRef.current =
      languages.findSingle('_id', props.selectedLangId) ??
      languages.findSingle('_id', mainLangId);
  }, [mainLangId, props.selectedLangId]);

  const checkMissingLanguage = (langId: string) => {
    const isMissing = props.ownedLanguages?.every((ownedLanguage) =>
      Array.isArray(ownedLanguage)
        ? ownedLanguage.every(
            (ownedLanguage_2) => langId != ownedLanguage_2.langId
          )
        : langId != ownedLanguage.langId
    );

    return isMissing;
  };

  const MissingWarning = () => {
    return (
      <ComponentToolTip message={t('warningAboutMissingLanguage')}>
        <i className={`mdi mdi-alert-circle text-warning fs-4`}></i>
      </ComponentToolTip>
    );
  };

  const Item = (itemProp: IThemeFormSelectData<ILanguageGetResultService>) => {
    const isSelectedItem =
      itemProp.value._id == selectedLanguageRef.current?._id;
    const isMissing =
      props.showMissingMessage && checkMissingLanguage(itemProp.value._id);
    return (
      <div className={`row p-0 ${!isSelectedItem ? 'my-2' : ''}`}>
        <div className="col-2">{isMissing ? <MissingWarning /> : null}</div>
        <div className="col-4 text-end">
          <Image
            className="img-fluid"
            width={35}
            height={45}
            src={PathUtil.getFlagURL(itemProp.value.image)}
            alt={itemProp.value.shortKey}
          />
        </div>
        <div className="col-6 text-start content-language-title align-content-center">
          <h6 className="mb-0">
            {itemProp.value.title} ({itemProp.value.locale.toUpperCase()})
          </h6>
        </div>
      </div>
    );
  };

  if (!selectedLanguageRef.current) {
    return null;
  }

  const options = languages
    .filter((item) => item._id != selectedLanguageRef.current?._id)
    .map((item) => ({
      label: item.title,
      value: item,
    }));

  return (
    <div className={`theme-input static content-language`}>
      <span className="label">{t('contentLanguage')}</span>
      <label className="field">
        <Select
          className="custom-select"
          classNamePrefix="custom-select"
          isSearchable={false}
          isMulti={false}
          formatOptionLabel={Item}
          options={options}
          value={{
            label: selectedLanguageRef.current.title,
            value: selectedLanguageRef.current,
          }}
          onChange={(item: any) => props.onChange(item)}
        />
      </label>
    </div>
  );
});

export default ComponentThemeLanguageSelector;
