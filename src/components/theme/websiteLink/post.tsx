import React from 'react';
import { PostTypeId } from '@constants/postTypes';
import { WebsiteEndPoints } from '@constants/websiteEndPoints';
import { PathUtil } from '@utils/path.util';

type IComponentProps = {
  typeId: PostTypeId;
  text?: string;
  url?: string;
  authorUrl?: string;
};

const ComponentThemeWebsiteLinkPost = React.memo((props: IComponentProps) => {
  let href = '';

  switch (props.typeId) {
    case PostTypeId.Blog:
      href = WebsiteEndPoints.BLOG(props.url);
      break;
    case PostTypeId.Page:
      href = WebsiteEndPoints.PAGE(props.url);
      break;
  }

  return href ? (
    <a href={PathUtil.getWebsiteURL(href)} target="_blank" rel="noreferrer">
      {props.text}
    </a>
  ) : (
    <>{props.text}</>
  );
});

export default ComponentThemeWebsiteLinkPost;
