/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectFileViewConfig, selectors } from '../../redux/selectors';
import { FileViewMode } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { makeLocalChonkyStyles } from '../../util/styles';
import { SmartFileEntry } from './FileEntry';
import { Virtuoso } from 'react-virtuoso';
import Box from '@mui/material/Box';
import BottomLoader from './BottomLoader';

export interface FileListListProps {
    hasNextPage?: boolean;
    isNextPageLoading?: boolean;
    loadNextPage?: any;
}

export const ListContainer: React.FC<FileListListProps> = React.memo(
    ({ hasNextPage, loadNextPage}) => {
        const viewConfig = useSelector(selectFileViewConfig);

        const displayFileIds = useSelector(selectors.getDisplayFileIds);
        const displayFileIdsRef = useInstanceVariable(displayFileIds);
        const getItemKey = useCallback(
            (index: number) =>
                displayFileIdsRef.current[index] ?? `loading-file-${index}`,
            [displayFileIdsRef]
        );

        const loadMoreItems = useMemo(
          () => (hasNextPage ? loadNextPage : () => void 0),
          [hasNextPage, loadNextPage]
      );

        const { classes } = useStyles();

        const listComponent = useMemo(() => {
            const rowRenderer = (index: number) => {
                return (
                    <Box height={viewConfig.entryHeight}>
                        <SmartFileEntry
                            fileId={displayFileIds[index] ?? null}
                            displayIndex={index}
                            fileViewMode={FileViewMode.List}
                        />
                    </Box>
                );
            };

            return (
                <Virtuoso
                    className={classes.listContainer}
                    totalCount={displayFileIds.length}
                    endReached={loadMoreItems}
                    itemContent={(index) => rowRenderer(index)}
                    computeItemKey={getItemKey}
                />
            );
        }, [displayFileIds, getItemKey]);

        return listComponent;
    }
);

const useStyles = makeLocalChonkyStyles((theme) => ({
    listContainer: {
        borderTop: `solid 1px ${theme.palette.divider}`,
        height: '100%',
    },
}));
