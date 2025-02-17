import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import { StatusId } from '@constants/status';
import { IPagePostAddState } from '@pages/post/add';
import ComponentThemeFormInputSwitch from '@components/theme/form/inputs/switch';

type IComponentProps = {
  status: IPagePostAddState['status'];
  statusId: StatusId;
  pageTypes?: IPagePostAddState['pageTypes'];
  authors?: IPagePostAddState['authors'];
  showStatusSelect?: boolean;
  showPageTypeSelect?: boolean;
  showAuthorsSelect?: boolean;
  showNoIndexCheckbox?: boolean;
};

const ComponentPagePostAddTabOptions = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      {props.showStatusSelect ? (
        <div className="col-md-7">
          <ComponentThemeFormInputSelect
            title={t('status')}
            name="statusId"
            options={props.status}
            valueAsNumber
            watch
          />
        </div>
      ) : null}
      {props.statusId == StatusId.Pending ? (
        <div className="col-md-7">
          <ComponentThemeFormInput
            title={`${t('startDate').toCapitalizeCase()}*`}
            type="date"
            name="dateStart"
          />
        </div>
      ) : null}
      <div className="col-md-7">
        <ComponentThemeFormInput
          title={t('rank')}
          name="rank"
          type="number"
        />
      </div>
      {props.showPageTypeSelect ? (
        <div className="col-md-7">
          <ComponentThemeFormInputSelect
            title={t('pageType')}
            name="pageTypeId"
            options={props.pageTypes}
            valueAsNumber
          />
        </div>
      ) : null}
      {props.showAuthorsSelect ? (
        <div className="col-md-7">
          <ComponentThemeFormInputSelect
            title={t('authors')}
            name="authors"
            isMulti
            closeMenuOnSelect={false}
            options={props.authors}
          />
        </div>
      ) : null}
      <div className="col-md-7">
        <ComponentThemeFormInputSwitch title={t('isFixed')} name="isFixed" />
      </div>
      {props.showNoIndexCheckbox ? (
        <div className="col-md-7">
          <ComponentThemeFormInputSwitch title={t('noIndex')} name="isNoIndex" />
        </div>
      ) : null}
    </div>
  );
});

export default ComponentPagePostAddTabOptions;
