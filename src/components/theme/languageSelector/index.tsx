import React from 'react';
import Image from 'next/image';
import ComponentInputSelect, {
  IComponentInputSelectData,
} from '@components/elements/inputs/select';
import { PathUtil } from '@utils/path.util';
import { ILanguageGetResultService } from 'types/services/language.service';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentToolTip from '@components/elements/tooltip';
import { ILanguageModel } from 'types/models/language.model';
import { useEffectAfterDidMount } from '@library/react/hooks';

const MissingWarning = () => {
  const t = useAppSelector(selectTranslation);

  return (
    <ComponentToolTip message={t('warningAboutMissingLanguage')}>
      <i className={`mdi mdi-alert-circle text-warning fs-4`}></i>
    </ComponentToolTip>
  );
};

type IComponentItemProps = {
  isSelected?: boolean;
  isMissing?: boolean;
} & IComponentInputSelectData<ILanguageGetResultService>;

const Item = (props: IComponentItemProps) => {
  return (
    <div className={`row p-0 ${!props.isSelected ? 'my-2' : ''}`}>
      <div className="col-2">{props.isMissing ? <MissingWarning /> : null}</div>
      <div className="col-4 text-end">
        <Image
          className="img-fluid"
          width={35}
          height={45}
          src={PathUtil.getFlagURL(props.value.image)}
          alt={props.value.shortKey}
        />
      </div>
      <div className="col-6 text-start content-language-title align-content-center">
        <h6 className="mb-0">
          {props.value.title} ({props.value.locale.toUpperCase()})
        </h6>
      </div>
    </div>
  );
};

type IOwnedLanguage = {
  langId: string;
};

type IComponentProps = {
  selectedLangId: string;
  onChange: (
    item: IComponentInputSelectData<ILanguageGetResultService>
  ) => void;
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

  if (!selectedLanguageRef.current) {
    return null;
  }

  const options: IComponentItemProps[] = languages
    .filter((item) => item._id != selectedLanguageRef.current?._id)
    .map((item) => ({
      label: item.title,
      value: item,
      isMissing: props.showMissingMessage && checkMissingLanguage(item._id),
      isSelected: item._id == selectedLanguageRef.current?._id,
    }));

  return (
    <ComponentInputSelect
      mainDivCustomClassName="content-language"
      title={t('contentLanguage')}
      isSearchable={false}
      isMulti={false}
      formatOptionLabel={Item}
      options={options}
      value={{
        label: selectedLanguageRef.current.title,
        value: selectedLanguageRef.current,
      }}
      onChange={(item) => props.onChange(item)}
    />
  );
});

export default ComponentThemeLanguageSelector;
