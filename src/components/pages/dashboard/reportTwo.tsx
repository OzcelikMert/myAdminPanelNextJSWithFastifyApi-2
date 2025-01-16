import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPageDashboardState } from '@pages/dashboard';
import WorldMap from 'react-svg-worldmap';
import ComponentChartArea from '@components/elements/charts/area';

type IComponentProps = {
  state: IPageDashboardState;
  setWorldMapSize: (size: IPageDashboardState['worldMapSize']) => void;
};

const ComponentPageDashboardReportTwo = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="row">
      <div className="col-md-7 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="clearfix mb-4">
              <h4 className="card-title float-start">
                {t('weeklyVisitorsStatistics')}
              </h4>
            </div>
            <div className="chart-container">
              <ComponentChartArea
                toolTipLabel={t('visitors')}
                data={props.state.viewsWithStatistics.day.map(
                  (view) => view.total
                )}
                labels={props.state.viewsWithStatistics.day.map(
                  (view) => view._id
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-5 grid-margin stretch-card">
        <div className="card">
          <div className="card-body overflow-auto">
            <h4 className="card-title">
              {t('weeklyVisitorsStatistics')} ({t('worldMap')})
            </h4>
            <div className="row d-none d-lg-block">
              <div className="col-md-12 text-end">
                <button
                  className="btn btn-gradient-success btn-sm"
                  onClick={() =>
                    props.setWorldMapSize(
                      props.state.worldMapSize == 'xl' ? 'xxl' : 'xl'
                    )
                  }
                >
                  <i className="fa fa-search-plus"></i>
                </button>
                <button
                  className="btn btn-gradient-danger btn-sm"
                  onClick={() =>
                    props.setWorldMapSize(
                      props.state.worldMapSize == 'xxl' ? 'xl' : 'lg'
                    )
                  }
                >
                  <i className="fa fa-search-minus"></i>
                </button>
              </div>
            </div>
            <div className="row overflow-auto">
              <WorldMap
                color="#b66dff"
                borderColor="var(--theme-worldmap-stroke-bg)"
                frameColor="red"
                strokeOpacity={0.4}
                backgroundColor="var(--theme-bg)"
                value-suffix="people"
                size={props.state.worldMapSize}
                data={props.state.viewsWithStatistics.country.map((view) => ({
                  country: (
                    view._id || window.navigator.language.slice(3)
                  ).toLowerCase(),
                  value: view.total,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPageDashboardReportTwo;
