import React from 'react';

type IComponentProps = {
  customClass?: string;
};

const ComponentSpinnerDonut = React.memo((props: IComponentProps) => {
  return (
    <div className={`component-spinner-donut ${props.customClass ?? ''}`}>
      <div className="spinner-bg"></div>
      <div className="spinner-wrapper">
        <div className="donut"></div>
      </div>
    </div>
  );
});

export default ComponentSpinnerDonut;