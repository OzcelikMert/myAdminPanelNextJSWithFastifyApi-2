import React from 'react';
import Link from 'next/link';
import { EndPoints } from '@constants/endPoints';
import { useAppSelector } from '@redux/hooks';
import { IBreadCrumbData } from '@redux/features/breadCrumbSlice';

const Item = React.memo((props: IBreadCrumbData & { isLast: boolean }) => {
  return (
    <span>
      <Link href={props.url ?? '#'}>
        <span className="badge badge-gradient-dark ms-2">{props.title}</span>
      </Link>
      {!props.isLast ? (
        <span className="badge badge-gradient-primary ms-2">
          <i className="mdi mdi-arrow-right"></i>
        </span>
      ) : null}
    </span>
  );
});

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
        <Item
          key={`bread-crumb-item-${index}`}
          {...item}
          isLast={breadCrumbs.length == index + 1}
        />
      ))}
    </h3>
  );
};

export default ComponentThemeBreadCrumb;
