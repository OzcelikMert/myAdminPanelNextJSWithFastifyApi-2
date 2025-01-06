import { ILanguageGetResultService } from 'types/services/language.service';
import ComponentToolTip from '@components/elements/tooltip';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@lib/hooks';
import { selectTranslation } from '@lib/features/translationSlice';
import { useDidMountHook } from '@library/react/customHooks';

type IComponentState = {
  missingLanguages: ILanguageGetResultService[];
};

type IItemLanguage = {
  langId: string;
};

type IComponentProps = {
  itemLanguages: IItemLanguage[] | IItemLanguage[][];
  div?: boolean;
  divClass?: string;
};

export default function ComponentThemeToolTipMissingLanguages(
  props: IComponentProps
) {
  const [missingLanguages, setMissingLanguages] = useState<
    IComponentState['missingLanguages']
  >([]);

  const t = useAppSelector(selectTranslation);
  const languages = useAppSelector((state) => state.settingState.languages);

  useDidMountHook(() => {
    init();
  });

  const init = () => {
    setMissingLanguages(findMissingLanguages());
  };

  const findMissingLanguages = () => {
    let missingLanguages = languages.filter(
      (language) =>
        !props.itemLanguages.some((itemLanguage) =>
          Array.isArray(itemLanguage)
            ? itemLanguage.every(
                (itemLanguage_2) => language._id == itemLanguage_2.langId
              )
            : language._id == itemLanguage.langId
        )
    );

    return missingLanguages;
  };

  const Icon = () => {
    return <i className={`mdi mdi-alert-circle text-warning fs-4`}></i>;
  };

  if (missingLanguages.length == 0) {
    return null;
  }

  return (
    <ComponentToolTip
      message={t('warningAboutMissingLanguagesWithVariable').replace(
        '{{missingLanguages}}',
        missingLanguages
          .map((missingLanguage) => missingLanguage.locale.toUpperCase())
          .join(', ')
      )}
    >
      {props.div ? (
        <div className={`${props.divClass}`}>
          <Icon />
        </div>
      ) : (
        <span>
          <Icon />{' '}
        </span>
      )}
    </ComponentToolTip>
  );
}
