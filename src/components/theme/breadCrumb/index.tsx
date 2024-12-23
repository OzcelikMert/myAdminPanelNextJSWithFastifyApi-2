import React, { Component } from 'react';
import Link from 'next/link';
import { EndPoints } from '@constants/endPoints';
import { useAppSelector } from '@lib/hooks';

export default function ComponentThemeBreadCrumb() {
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
          <Link href={item.url ?? '#'}>
            <label className="badge badge-gradient-dark ms-2">
              {item.title}
            </label>
          </Link>
          {breadCrumbs.length != index + 1 ? (
            <label className="badge badge-gradient-primary ms-2">
              <i className="mdi mdi-arrow-right"></i>
            </label>
          ) : null}
        </span>
      ))}
    </h3>
  );
}
