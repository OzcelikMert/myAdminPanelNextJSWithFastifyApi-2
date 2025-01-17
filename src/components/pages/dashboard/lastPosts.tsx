import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentDataTable, {
  IComponentDataTableColumn,
} from '@components/elements/table/dataTable';
import { IPageDashboardState } from '@pages/dashboard';

type IComponentProps = {
  lastPosts: IPageDashboardState['lastPosts'];
  columns: IComponentDataTableColumn<IPageDashboardState['lastPosts'][0]>[];
};

const ComponentPageDashboardLastPosts = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="page-post">
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{t('lastPosts')}</h4>
              <div className="table-post">
                <ComponentDataTable
                  columns={props.columns}
                  data={props.lastPosts}
                  i18={{
                    search: t('search'),
                    noRecords: t('noRecords'),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPageDashboardLastPosts;
