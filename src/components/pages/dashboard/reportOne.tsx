import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPageDashboardState } from '@pages/dashboard';

type IComponentProps = {
  state: IPageDashboardState;
};

const ComponentPageDashboardReportOne = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="col-12 grid-margin">
      <div className="card card-statistics">
        <div className="row">
          <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                <i className="mdi mdi-account-multiple-outline text-primary ms-0 me-sm-4 icon-lg"></i>
                <div className="wrapper text-center text-sm-end">
                  <p className="card-text mb-0 text-dark">
                    {t('currentVisitors')}
                  </p>
                  <div className="fluid-container">
                    <h3 className="mb-0 font-weight-medium text-dark">
                      {props.state.viewsWithNumber.liveTotal}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                <i className="mdi mdi-target text-primary ms-0 me-sm-4 icon-lg"></i>
                <div className="wrapper text-center text-sm-end">
                  <p className="card-text mb-0 text-dark">
                    {t('dailyAverageVisitors')}
                  </p>
                  <div className="fluid-container">
                    <h3 className="mb-0 font-weight-medium text-dark">
                      {props.state.viewsWithNumber.averageTotal}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                <i className="mdi mdi-calendar-week text-primary ms-0 me-sm-4 icon-lg"></i>
                <div className="wrapper text-center text-sm-end">
                  <p className="card-text mb-0 text-dark">
                    {t('weeklyTotalVisitors')}
                  </p>
                  <div className="fluid-container">
                    <h3 className="mb-0 font-weight-medium text-dark">
                      {props.state.viewsWithNumber.weeklyTotal}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                <i className="mdi mdi-google-analytics text-primary ms-0 me-sm-4 icon-lg"></i>
                <div className="wrapper text-center text-sm-end">
                  <p className="card-text mb-0 text-dark">
                    {t('lifeTimeVisitors')}
                  </p>
                  <div className="fluid-container">
                    <h3 className="mb-0 font-weight-medium text-dark">
                      <a
                        target="_blank"
                        className="text-info fs-6 text-decoration-none"
                        href={
                          props.state.settings.googleAnalyticURL ??
                          'javascript:void(0);'
                        }
                      >
                        {t('clickToSee')}
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPageDashboardReportOne;
