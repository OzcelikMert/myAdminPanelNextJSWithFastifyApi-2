import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentFormSelect from '@components/elements/form/input/select';
import ComponentFormInput from '@components/elements/form/input/input';
import ComponentFormCheckBox from '@components/elements/form/input/checkbox';
import { StatusId } from '@constants/status';
import { IPagePostAddState } from '@pages/post/add';
import { PageTypeId } from '@constants/pageTypes';

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
          <ComponentFormSelect
            title={t('status')}
            name="statusId"
            options={props.status}
            value={props.status?.findSingle('value', props.statusId)}
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
          required={true}
        />
      </div>
      {props.showPageTypeSelect ? (
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('pageType')}
            name="pageTypeId"
            options={props.pageTypes}
            value={props.pageTypes?.findSingle('value', props.pageTypeId || '')}
          />
        </div>
      ) : null}
      {props.showAuthorsSelect ? (
        <div className="col-md-7 mb-3">
          <ComponentFormSelect
            title={t('authors')}
            name="authors"
            isMulti
            closeMenuOnSelect={false}
            options={props.authors}
            value={props.authors?.filter((selectAuthor) =>
              props.selectedAuthors?.includes(selectAuthor.value)
            )}
          />
        </div>
      ) : null}
      <div className="col-md-7 mb-3">
        <ComponentFormCheckBox title={t('isFixed')} name="isFixed" />
      </div>
      {props.showNoIndexCheckBox ? (
        <div className="col-md-7">
          <ComponentFormCheckBox title={t('noIndex')} name="isNoIndex" />
        </div>
      ) : null}
    </div>
  );
});

export default ComponentPagePostAddTabOptions;
