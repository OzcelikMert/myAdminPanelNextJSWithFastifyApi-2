import React from 'react';
import Image from 'next/image';
import ComponentFormSelect, {
  IThemeFormSelectData,
} from '@components/elements/form/input/select';
import { PathUtil } from '@utils/path.util';
import { ILanguageGetResultService } from 'types/services/language.service';
import { useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';

type IComponentProps = {
  selectedLanguage: ILanguageGetResultService;
  onChange: (item: IThemeFormSelectData<ILanguageGetResultService>) => void;
};

export default function ComponentThemeContentLanguage(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);
  const languages = useAppSelector((state) => state.settingState.languages);

  const Item = (itemProp: IThemeFormSelectData<ILanguageGetResultService>) => (
    <div className={`row p-0`}>
      <div className="col-6 text-end">
        <Image
          className="img-fluid"
          width={35}
          height={45}
          src={PathUtil.getFlagURL(itemProp.value.image)}
          alt={itemProp.value.shortKey}
        />
      </div>
      <div className="col-6 text-start content-language-title">
        <h6>
          {itemProp.value.title} ({itemProp.value.locale.toUpperCase()})
        </h6>
      </div>
    </div>
  );

  return (
    <ComponentFormSelect
      title={t('contentLanguage')}
      isSearchable={false}
      isMulti={false}
      formatOptionLabel={Item}
      options={languages.map((language) => ({
        label: language.title,
        value: language,
      }))}
      value={{
        label: props.selectedLanguage.title,
        value: props.selectedLanguage,
      }}
      onChange={(item: any) => props.onChange(item)}
    />
  );
}
