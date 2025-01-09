import React from 'react';
import Image from 'next/image';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import { PathUtil } from '@utils/path.util';
import { ILanguageGetResultService } from 'types/services/language.service';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentToolTip from '@components/elements/tooltip';

type IOwnedLanguage = {
  langId: string;
};

type IComponentProps = {
  selectedLangId: string;
  onChange: (item: IThemeFormSelectData<ILanguageGetResultService>) => void;
  ownedLanguages?: IOwnedLanguage[] | IOwnedLanguage[][];
  showMissingMessage?: boolean;
};

export default function ComponentThemeContentLanguage(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);
  const languages = useAppSelector((state) => state.settingState.languages);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);
  const selectedLanguage =
    languages.findSingle('_id', props.selectedLangId) ??
    languages.findSingle('_id', mainLangId);

  const checkMissingLanguage = (langId: string) => {
    const isMissing = props.ownedLanguages?.every((ownedLanguage) =>
      Array.isArray(ownedLanguage)
        ? ownedLanguage.every((ownedLanguage_2) => langId != ownedLanguage_2.langId)
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
    const isSelectedItem = itemProp.value._id == selectedLanguage?._id;
    const isMissing = props.showMissingMessage && checkMissingLanguage(itemProp.value._id);
    return (
      <div className={`row p-0 ${!isSelectedItem ? 'my-2' : ''}`}>
        <div className="col-2">
          {isMissing ? <MissingWarning /> : null}
        </div>
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

  if (!selectedLanguage) {
    return null;
  }

  const options = languages
    .filter((item) => item._id != selectedLanguage._id)
    .map((item) => ({
      label: item.title,
      value: item,
    }));

  return (
    <ComponentFormSelect
      title={t('contentLanguage')}
      mainDivCustomClassName="content-language"
      isSearchable={false}
      isMulti={false}
      formatOptionLabel={Item}
      options={options}
      value={{
        label: selectedLanguage.title,
        value: selectedLanguage,
      }}
      onChange={(item: any) => props.onChange(item)}
    />
  );
}
