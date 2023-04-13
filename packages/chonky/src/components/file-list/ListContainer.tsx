/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React, { CSSProperties, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { selectFileViewConfig, selectors } from '../../redux/selectors';
import { FileViewMode } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { makeLocalChonkyStyles } from '../../util/styles';
import { SmartFileEntry } from './FileEntry';
import InfiniteLoader from 'react-window-infinite-loader';
import CircularProgress from '@mui/material/CircularProgress';
export interface FileListListProps {
  width: number;
  height: number;
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: any;

}

export const ListContainer: React.FC<FileListListProps> = React.memo((props) => {
  const { width, height } = props;

  const viewConfig = useSelector(selectFileViewConfig);


  const displayFileIds = useSelector(selectors.getDisplayFileIds);
  const displayFileIdsRef = useInstanceVariable(displayFileIds);
  const getItemKey = useCallback(
    (index: number) => displayFileIdsRef.current[index] ?? `loading-file-${index}`,
    [displayFileIdsRef]
  );
  const itemCount = props.hasNextPage ? displayFileIds.length + 1 : displayFileIds.length;

  const loadMoreItems = props.isNextPageLoading ? () => { } : props.loadNextPage;

  const isItemLoaded = (index: number) => !props.hasNextPage || index < displayFileIds.length;

  const {classes} = useStyles();
  const listComponent = useMemo(() => {
    // When entry size is null, we use List view
    const rowRenderer = (data: { index: number; style: CSSProperties }) => {

      return (
        <div style={data.style} >
          {!isItemLoaded(data.index) ?
            <CircularProgress /> :
            <SmartFileEntry
              fileId={displayFileIds[data.index] ?? null}
              displayIndex={data.index}
              fileViewMode={FileViewMode.List}
            />}
        </div>
      );
    };

    return (
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            ref={ref as any}
            className={classes.listContainer}
            itemSize={viewConfig.entryHeight}
            onItemsRendered={onItemsRendered}
            height={height}
            itemCount={displayFileIds.length}
            width={width}
            itemKey={getItemKey}
          >
            {rowRenderer}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    );
  }, [
    classes.listContainer,
    viewConfig.entryHeight,
    height,
    displayFileIds,
    width,
    getItemKey,
  ]);

  return listComponent;
});

const useStyles = makeLocalChonkyStyles((theme) => ({
  listContainer: {
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
}));
