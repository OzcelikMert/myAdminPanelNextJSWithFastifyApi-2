import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import ComponentSpinnerDonut from '@components/elements/spinners/donut';
import { IPageSettingsGeneralState } from '@pages/settings/general';

type IComponentProps = {
  info: IPageSettingsGeneralState['serverInfo'];
  isLoading?: IPageSettingsGeneralState['isServerInfoLoading'];
};

const ComponentPageSettingsGeneralServerInfo = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="col-12 grid-margin">
        <div className="card card-statistics">
          <div className="row">
            <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row ">
                  <i className="mdi mdi-harddisk text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">{t('storage')}</p>
                    <div className="fluid-container position-relative">
                      {props.isLoading ? (
                        <ComponentSpinnerDonut />
                      ) : (
                        <h3 className="mb-0 font-weight-medium text-dark">
                          {props.info.storage}%
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                  <i className="mdi mdi-memory text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">{t('memory')}</p>
                    <div className="fluid-container position-relative">
                      {props.isLoading ? (
                        <ComponentSpinnerDonut />
                      ) : (
                        <h3 className="mb-0 font-weight-medium text-dark">
                          {props.info.memory}%
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                  <i className="fa fa-microchip text-primary ms-0 me-sm-4 icon-lg"></i>
                  <div className="wrapper text-center text-sm-end">
                    <p className="card-text mb-0 text-dark">{t('processor')}</p>
                    <div className="fluid-container position-relative">
                      {props.isLoading ? (
                        <ComponentSpinnerDonut />
                      ) : (
                        <h3 className="mb-0 font-weight-medium text-dark">
                          {props.info.cpu}%
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPageSettingsGeneralServerInfo;
