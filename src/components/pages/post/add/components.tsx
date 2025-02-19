import React from 'react';
import { useAppSelector } from '@redux/hooks';
import { selectTranslation } from '@redux/features/translationSlice';
import { IPagePostAddState } from '@pages/post/add';
import ComponentPagePostAddComponentsItem from './componentsItem';
import ComponentThemeToolTipFormFieldErrors from '@components/theme/tooltip/formFieldErrors';

type IComponentProps = {
  components?: IPagePostAddState['components'];
  selectedComponents?: string[];
  showEditButton?: boolean;
  onClickAddNew: () => void;
  onClickDelete: (_id: string) => void;
};

const ComponentPagePostAddComponents = React.memo((props: IComponentProps) => {
  const t = useAppSelector(selectTranslation);

  return (
    <div className="grid-margin stretch-card">
      <div className="card">
        <div className="card-header text-center pt-3">
          <h4>
            {t('components')}{' '}
            <ComponentThemeToolTipFormFieldErrors
              keys={['components']}
              hideFieldTitles
            />
          </h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-7 mt-2">
              <div className="row">
                {props.selectedComponents?.map((item, index) => (
                  <ComponentPagePostAddComponentsItem
                    key={`post-component-item-${index}`}
                    item={item}
                    index={index}
                    components={props.components}
                    showEditButton={props.showEditButton}
                    onClickAddNew={() => props.onClickAddNew()}
                    onClickDelete={(_id) => props.onClickDelete(_id)}
                  />
                ))}
                <div
                  className={`col-md-7 text-start ${(props.components?.length ?? 0) > 0 ? 'mt-4' : ''}`}
                >
                  <button
                    type={'button'}
                    className="btn btn-gradient-success btn-lg"
                    onClick={() => props.onClickAddNew()}
                  >
                    + {t('addNew')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ComponentPagePostAddComponents;
