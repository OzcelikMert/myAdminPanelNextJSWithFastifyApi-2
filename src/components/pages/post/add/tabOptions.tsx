import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormInputSelect from '@components/elements/form/inputs/select';
import ComponentFormInput from '@components/elements/form/inputs/input';
import ComponentFormInputCheckbox from '@components/elements/form/inputs/checkbox';
import { StatusId } from '@constants/status';
import { IPagePostAddState } from '@pages/post/add';
import { PageTypeId } from '@constants/pageTypes';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  status: IPagePostAddState['status'];
  statusId: StatusId;
  pageTypes?: IPagePostAddState['pageTypes'];
  pageTypeId?: PageTypeId;
  authors?: IPagePostAddState['authors'];
  selectedAuthors?: string[];
  showStatusSelect?: boolean;
  showPageTypeSelect?: boolean;
  showAuthorsSelect?: boolean;
  showNoIndexCheckBox?: boolean;
};

const ComponentPagePostAddTabOptions = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      {props.showStatusSelect ? (
        <div className="col-md-7 mb-3">
          <ComponentFormInputSelect
            title={t('status')}
            name="statusId"
            options={props.status}
            valueAsNumber
            watch
          />
        </div>
      ) : null}
      {props.statusId == StatusId.Pending ? (
        <div className="col-md-7 mb-3">
          <ComponentFormInput
            title={`${t('startDate').toCapitalizeCase()}*`}
            type="date"
            name="dateStart"
          />
        </div>
      ) : null}
      <div className="col-md-7 mb-3">
        <ComponentFormInput
          title={t('rank')}
          name="rank"
          type="number"
          i18={{
            setErrorText: (errorCode) =>
              t(I18Util.getFormInputErrorText(errorCode), [t('rank')]),
          }}
          required
        />
      </div>
      {props.showPageTypeSelect ? (
        <div className="col-md-7 mb-3">
          <ComponentFormInputSelect
            title={t('pageType')}
            name="pageTypeId"
            options={props.pageTypes}
            valueAsNumber
          />
        </div>
      ) : null}
      {props.showAuthorsSelect ? (
        <div className="col-md-7 mb-3">
          <ComponentFormInputSelect
            title={t('authors')}
            name="authors"
            isMulti
            closeMenuOnSelect={false}
            options={props.authors}
          />
        </div>
      ) : null}
      <div className="col-md-7 mb-3">
        <ComponentFormInputCheckbox title={t('isFixed')} name="isFixed" />
      </div>
      {props.showNoIndexCheckBox ? (
        <div className="col-md-7">
          <ComponentFormInputCheckbox title={t('noIndex')} name="isNoIndex" />
        </div>
      ) : null}
    </div>
  );
});

export default ComponentPagePostAddTabOptions;
