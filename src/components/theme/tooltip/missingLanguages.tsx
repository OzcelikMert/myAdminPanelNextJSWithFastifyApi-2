import { ILanguageGetResultService } from 'types/services/language.service';
import ComponentToolTip from '@components/elements/tooltip';
import React, { useState } from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import {
  useDidMount,
  useEffectAfterDidMount,
} from '@library/react/hooks';

const Icon = () => {
  return <i className={`mdi mdi-alert-circle text-warning fs-4`}></i>;
};

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

const ComponentThemeToolTipMissingLanguages = React.memo(
  (props: IComponentProps) => {
    const [missingLanguages, setMissingLanguages] = useState<
      IComponentState['missingLanguages']
    >([]);

    const t = useAppSelector(selectTranslation);
    const languages = useAppSelector((state) => state.settingState.languages);

    useDidMount(() => {
      init();
    });

    useEffectAfterDidMount(() => {
      init();
    }, [props.itemLanguages]);

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

    if (missingLanguages.length == 0) {
      return null;
    }

    return (
      <ComponentToolTip
        message={t('warningAboutMissingLanguagesWithVariable', [
          missingLanguages
            .map((missingLanguage) => missingLanguage.locale.toUpperCase())
            .join(', '),
        ])}
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
);

export default ComponentThemeToolTipMissingLanguages;
