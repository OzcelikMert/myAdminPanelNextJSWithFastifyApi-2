import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPageUserAddState } from '@pages/user/add';

type IComponentProps = {
  state: IPageUserAddState;
  onNavigatePage: () => void;
};

const ComponentPageUserAddHeader = React.memo(
  (props: IComponentProps) => {
    const t = useAppSelector(selectTranslation);

    return (
      <div className="col-md-3">
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
              onClick={() => props.onNavigatePage()}
            >
              <i className="mdi mdi-arrow-left"></i> {t('returnBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default ComponentPageUserAddHeader;
