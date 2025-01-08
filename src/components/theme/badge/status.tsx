import React, { Component } from 'react';
import { status, StatusId } from '@constants/status';
import ComponentToolTip from '@components/elements/tooltip';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';

type IComponentProps = {
  statusId: StatusId;
  className?: string;
  date?: string;
};

export default function ComponentThemeBadgeStatus(props: IComponentProps) {
  const t = useAppSelector(selectTranslation);

  const langKey =
    status.findSingle('id', props.statusId)?.langKey ?? '[noLangAdd]';

  return (
    <ComponentToolTip
      message={
        props.statusId == StatusId.Pending && props.date
          ? `${t('pending')}: ${new Date(props.date).toLocaleDateString()}`
          : t(langKey)
      }
    >
      <label
        className={`badge badge-gradient-${getStatusColor(props.statusId)} text-start ${props.className ?? ''}`}
      >
        <i className={`${getStatusIcon(props.statusId)} me-2`}></i>
        {t(langKey)}
      </label>
    </ComponentToolTip>
  );
}

export function getStatusColor(statusId: number): string {
  let className = ``;
  switch (statusId) {
    case StatusId.Active:
      className = `success`;
      break;
    case StatusId.Pending:
    case StatusId.Banned:
    case StatusId.Disabled:
      className = `dark`;
      break;
    case StatusId.InProgress:
      className = `warning`;
      break;
    case StatusId.Deleted:
      className = `danger`;
      break;
  }
  return className;
}

export function getStatusIcon(statusId: number): string {
  let className = ``;
  switch (statusId) {
    case StatusId.Active:
      className = `mdi mdi-check`;
      break;
    case StatusId.Pending:
      className = `mdi mdi-clock-outline`;
      break;
    case StatusId.Banned:
      className = `mdi mdi-cancel`;
      break;
    case StatusId.InProgress:
      className = `mdi mdi-wrench-clock-outline`;
      break;
    case StatusId.Deleted:
      className = `mdi mdi-trash-can-outline`;
      break;
    case StatusId.Disabled:
      className = `mdi mdi-eye-off-outline`;
      break;
  }
  return className;
}
