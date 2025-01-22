import React, { Component } from 'react';
import Link from 'next/link';
import { EndPoints } from '@constants/endPoints';
import { useAppSelector } from '@redux/hooks';

const ComponentThemeBreadCrumb = () => {
  const breadCrumbs = useAppSelector((state) => state.breadCrumbState.data);

  return (
    <h3 className="page-title">
      <Link href={EndPoints.DASHBOARD}>
        <span className="page-title-icon bg-gradient-primary text-white me-2">
          <i className="mdi mdi-home"></i>
        </span>
      </Link>
      {breadCrumbs.map((item, index) => (
        <span>
          <Link href={item.url ?? 'javascript:void(0);'}>
            <span className="badge badge-gradient-dark ms-2">
              {item.title}
            </span>
          </Link>
          {breadCrumbs.length != index + 1 ? (
            <span className="badge badge-gradient-primary ms-2">
              <i className="mdi mdi-arrow-right"></i>
            </span>
          ) : null}
        </span>
      ))}
    </h3>
  );
}

export default ComponentThemeBreadCrumb;