import React from 'react';
import { PostTypeId } from '@constants/postTypes';
import { PostTermTypeId } from '@constants/postTermTypes';
import { WebsiteEndPoints } from '@constants/websiteEndPoints';
import { PathUtil } from '@utils/path.util';

type IComponentProps = {
  postTypeId: PostTypeId;
  typeId: PostTermTypeId;
  text?: string;
  url?: string;
  authorUrl?: string;
};

const ComponentThemeWebsiteLinkPostTerm = React.memo(
  (props: IComponentProps) => {
    let href = '';

    switch (props.postTypeId) {
      case PostTypeId.Blog:
        switch (props.typeId) {
          case PostTermTypeId.Category:
            href = WebsiteEndPoints.BLOGS_WITH.CATEGORY(props.url);
            break;
        }
        break;
    }

    return href ? (
      <a href={PathUtil.getWebsiteURL(href)} target="_blank" rel="noreferrer">
        {props.text}
      </a>
    ) : (
      <>{props.text}</>
    );
  }
);

export default ComponentThemeWebsiteLinkPostTerm;
