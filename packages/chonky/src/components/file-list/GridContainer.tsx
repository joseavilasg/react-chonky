import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectFileViewConfig, selectors } from '../../redux/selectors';
import { FileViewConfigGrid } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { makeLocalChonkyStyles } from '../../util/styles';
import { SmartFileEntry } from './FileEntry';
import { Box } from '@mui/material';
import { VirtuosoGrid } from 'react-virtuoso';
import BottomLoader from './BottomLoader';
import { useContainerQueries } from 'use-container-queries';

export const isMobileDevice = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
};
export interface FileListGridProps {
    hasNextPage?: boolean;
    isNextPageLoading?: boolean;
    loadNextPage?: any;
}

const breakpoints = {
    xs: [0, 480],
    sm: [481, 600],
    md: [601, 900],
    lg: [901, 1200],
    xl: [1201],
};

const gridsize = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
};

export const GridContainer: React.FC<FileListGridProps> = React.memo(
    ({ hasNextPage, loadNextPage}) => {
        const viewConfig = useSelector(selectFileViewConfig) as FileViewConfigGrid;

        const displayFileIds = useSelector(selectors.getDisplayFileIds);

        const displayFileIdsRef = useInstanceVariable(displayFileIds);

        const getItemKey = useCallback(
            (index: number) =>
                displayFileIdsRef.current[index] ?? `loading-file-${index}`,
            [displayFileIdsRef]
        );

        //@ts-ignore
        const { ref, active: breakpoint } = useContainerQueries({ breakpoints });

        const cellRenderer = useCallback(
            (index: number) => {
                const fileId = displayFileIds[index];
                if (displayFileIds[index] === undefined) return null;

                return (
                    <Box sx={{ aspectRatio: '16/11' }}>
                        <SmartFileEntry
                            fileId={fileId ?? null}
                            displayIndex={index}
                            fileViewMode={viewConfig.mode}
                        />
                    </Box>
                );
            },
            [displayFileIds, viewConfig.mode]
        );

        const loadMoreItems = useMemo(
            () => (hasNextPage ? loadNextPage : () => void 0),
            [hasNextPage, loadNextPage]
        );

        const { classes } = useStyles(breakpoint);

        const gridComponent = useMemo(() => {
            return (
                <Box sx={{ width: '100%', height: '100%' }} ref={ref}>
                    <VirtuosoGrid
                        listClassName={classes.gridContainer}
                        totalCount={displayFileIds.length}
                        endReached={loadMoreItems}
                        itemContent={(index) => cellRenderer(index)}
                        computeItemKey={getItemKey}
                    />
                </Box>
            );
        }, [classes.gridContainer, cellRenderer]);

        return gridComponent;
    }
);

const useStyles = makeLocalChonkyStyles((_, breakpoint) => ({
    gridContainer: {
        display: 'grid',
        gap: '8px',
        paddingRight: '16px',
        paddingLeft: '8px',
        gridTemplateColumns: `repeat(${gridsize[breakpoint]}, minmax(180px, 1fr))`,
    },
}));
