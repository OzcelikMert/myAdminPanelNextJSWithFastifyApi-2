import { ILanguageGetResultService } from 'types/services/language.service';
import ComponentToolTip from '@components/elements/tooltip';
import React, { useState } from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { useDidMount, useEffectAfterDidMount } from '@library/react/hooks';

const Icon = () => {
  return <i className={`mdi mdi-alert-circle text-warning fs-4`}></i>;
};

type IComponentState = {
  missingLanguages: ILanguageGetResultService[];
};

export type IAlternate = {
  langId: string;
};

type IComponentProps = {
  alternates: IAlternate[] | IAlternate[][] | (IAlternate | IAlternate[])[];
  div?: boolean;
  divClass?: string;
  language?: ILanguageGetResultService;
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
    }, [props.alternates]);

    const init = () => {
      setMissingLanguages(findMissingLanguages());
    };

    const checkIsMissing = (langId: string) => {
      return !props.alternates.some((alternate) =>
        Array.isArray(alternate)
          ? alternate.some(
              (alternateSub) => langId == alternateSub.langId
            )
          : langId == alternate.langId
      );
    };

    const findMissingLanguages = () => {
      return props.language
        ? checkIsMissing(props.language._id)
          ? [props.language]
          : []
        : languages.filter((language) => checkIsMissing(language._id));
    };

    if (missingLanguages.length == 0) {
      return null;
    }

    return (
      <ComponentToolTip
        message={
          props.language
            ? t('warningAboutMissingLanguage')
            : t('warningAboutMissingLanguagesWithVariable', [
                missingLanguages
                  .map((missingLanguage) =>
                    missingLanguage.locale.toUpperCase()
                  )
                  .join(', '),
              ])
        }
      >
        {props.div ? (
          <div className={`${props.divClass ?? ""}`}>
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
