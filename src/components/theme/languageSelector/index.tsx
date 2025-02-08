import React from 'react';
import Image from 'next/image';
import ComponentInputSelect, {
  IComponentInputSelectData,
} from '@components/elements/inputs/select';
import { PathUtil } from '@utils/path.util';
import { ILanguageGetResultService } from 'types/services/language.service';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeToolTipMissingLanguages, {
  IAlternate,
} from '../tooltip/missingLanguages';

type IComponentItemProps = {
  isSelected?: boolean;
  alternates?: IAlternate[] | IAlternate[][] | (IAlternate | IAlternate[])[];
} & IComponentInputSelectData<ILanguageGetResultService>;

const Item = (props: IComponentItemProps) => {
  return (
    <div className={`row p-0 ${props.isSelected ? '' : 'my-2'}`}>
      <div className="col-2">
        <ComponentThemeToolTipMissingLanguages
          alternates={props.alternates ?? []}
          language={props.value}
        />
      </div>
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

type IComponentState = {
  selectedLangId: string;
};

const initialState: IComponentState = {
  selectedLangId: '',
};

type IComponentProps = {
  selectedLangId: string;
  onChange: (
    item: IComponentInputSelectData<ILanguageGetResultService>
  ) => void;
  alternates?: IAlternate[] | IAlternate[][] | (IAlternate | IAlternate[])[];
};

const ComponentThemeLanguageSelector = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);
  const languages = useAppSelector((state) => state.settingState.languages);
  const mainLangId = useAppSelector((state) => state.settingState.mainLangId);

  const [selectedLangId, setSelectedLangId] = React.useState(
    languages.findSingle('_id', props.selectedLangId)?._id ??
      languages.findSingle('_id', mainLangId)?._id ??
      initialState.selectedLangId
  );

  const onChange = (newValue: IComponentInputSelectData<ILanguageGetResultService>) => {
    setSelectedLangId(newValue.value._id);
    props.onChange(newValue);
  };

  const selectedLanguage = languages.findSingle('_id', selectedLangId);

  if (!selectedLanguage) {
    return null;
  }

  const options: IComponentItemProps[] = languages
    .filter((item) => item._id != selectedLangId)
    .map((item) => ({
      label: item.title,
      value: item,
      alternates: props.alternates,
    }));

  return (
    <ComponentInputSelect
      mainDivCustomClassName="content-language"
      title={t('contentLanguage')}
      formatOptionLabel={Item}
      options={options}
      value={{
        label: selectedLanguage.title,
        value: selectedLanguage,
        isSelected: true,
        alternates: props.alternates,
      }}
      onChange={(newValue: any) => onChange(newValue)}
    />
  );
});

export default ComponentThemeLanguageSelector;
