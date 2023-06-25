import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectFileViewConfig, selectors } from '../../redux/selectors';
import { FileViewConfigGrid } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { makeLocalChonkyStyles } from '../../util/styles';
import { SmartFileEntry } from './FileEntry';
import { Box } from '@mui/material';
import { VirtuosoGrid } from 'react-virtuoso'
import BottomLoader from './BottomLoader';

export const isMobileDevice = () => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}
export interface FileListGridProps {

  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: any;
}

export const GridContainer: React.FC<FileListGridProps> = React.memo((props) => {

  const viewConfig = useSelector(selectFileViewConfig) as FileViewConfigGrid;

  const displayFileIds = useSelector(selectors.getDisplayFileIds);

  const displayFileIdsRef = useInstanceVariable(displayFileIds);

  const getItemKey = useCallback(
    (index: number) => displayFileIdsRef.current[index] ?? `loading-file-${index}`,
    [displayFileIdsRef]
  );

  const cellRenderer = useCallback(
    (index: number) => {
      const fileId = displayFileIds[index];
      if (displayFileIds[index] === undefined) return null;

      return (
        <Box sx={{ aspectRatio: '16/11' }}>
          <SmartFileEntry fileId={fileId ?? null} displayIndex={index} fileViewMode={viewConfig.mode} />
        </Box>
      );
    },
    [displayFileIds, viewConfig.mode]
  );

  const loadMoreItems = props.isNextPageLoading ? () => { } : props.loadNextPage;

  const { classes } = useStyles();

  const gridComponent = useMemo(() => {
    return (
      <VirtuosoGrid
        listClassName={classes.gridContainer}
        totalCount={displayFileIds.length}
        endReached={loadMoreItems}
        itemContent={index => cellRenderer(index)}
        computeItemKey={getItemKey}
        components={{ Footer: () => props.isNextPageLoading ? <BottomLoader /> : null }}
      />
    );
  }, [
    classes.gridContainer,
    cellRenderer,
  ]);

  return gridComponent;
});

const useStyles = makeLocalChonkyStyles((theme) => ({
  gridContainer: {
    display: 'grid',
    gap: '8px',
    paddingRight: '16px',
    paddingLeft: '8px',
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: 'repeat(6, minmax(200px, 1fr))'
    },
    [theme.breakpoints.down('xl')]: {
      gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))'
    },
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))'
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))'
    },
    "@media (max-width: 768px)": {
      gridTemplateColumns: 'repeat(2, minmax(200px, 1fr))'
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: 'repeat(1, minmax(200px, 1fr))'
    }
  },
}));
