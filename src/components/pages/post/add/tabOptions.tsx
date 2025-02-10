import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentThemeFormInputSelect from '@components/theme/form/inputs/select';
import ComponentThemeFormInput from '@components/theme/form/inputs/input';
import ComponentThemeFormInputCheckbox from '@components/theme/form/inputs/checkbox';
import { StatusId } from '@constants/status';
import { IPagePostAddState } from '@pages/post/add';
import { I18Util } from '@utils/i18.util';

type IComponentProps = {
  status: IPagePostAddState['status'];
  statusId: StatusId;
  pageTypes?: IPagePostAddState['pageTypes'];
  authors?: IPagePostAddState['authors'];
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
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInput
            title={`${t('startDate').toCapitalizeCase()}*`}
            type="date"
            name="dateStart"
          />
        </div>
      ) : null}
      <div className="col-md-7 mb-3">
        <ComponentThemeFormInput
          title={t('rank')}
          name="rank"
          type="number"
          required
        />
      </div>
      {props.showPageTypeSelect ? (
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInputSelect
            title={t('pageType')}
            name="pageTypeId"
            options={props.pageTypes}
            valueAsNumber
          />
        </div>
      ) : null}
      {props.showAuthorsSelect ? (
        <div className="col-md-7 mb-3">
          <ComponentThemeFormInputSelect
            title={t('authors')}
            name="authors"
            isMulti
            closeMenuOnSelect={false}
            options={props.authors}
          />
        </div>
      ) : null}
      <div className="col-md-7 mb-3">
        <ComponentThemeFormInputCheckbox title={t('isFixed')} name="isFixed" />
      </div>
      {props.showNoIndexCheckBox ? (
        <div className="col-md-7">
          <ComponentThemeFormInputCheckbox title={t('noIndex')} name="isNoIndex" />
        </div>
      ) : null}
    </div>
  );
});

export default ComponentPagePostAddTabOptions;
