import React from 'react';

type IComponentProps = {
  customClass?: string;
};

export default function ComponentSpinnerDonut({
  customClass,
}: IComponentProps) {
  return (
    <div className={`component-spinner-donut ${customClass ?? ''}`}>
      <div className="spinner-bg"></div>
      <div className="spinner-wrapper">
        <div className="donut"></div>
      </div>
    </div>
  );
}
