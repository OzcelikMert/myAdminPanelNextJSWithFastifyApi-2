import React from 'react';
import ComponentThemeBreadCrumb from '@components/theme/breadCrumb';

const ComponentToolHeader = React.memo(() => {
  return (
    <div className="page-header">
      <div className="row w-100 m-0">
        <div className="col-md-8 p-0">
          <ComponentThemeBreadCrumb />
        </div>
      </div>
    </div>
  );
});

export default ComponentToolHeader;
