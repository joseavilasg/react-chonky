import React, { useCallback, useMemo, forwardRef } from "react";
import { useSelector } from "react-redux";
import { selectFileViewConfig, selectors } from "@/redux/selectors";
import { FileListProps } from "@/types/file-list.types";
import { FileViewConfigGrid } from "@/types/file-view.types";
import { useInstanceVariable } from "@/util/hooks-helpers";
import { makeStyles } from "tss-react/mui";
import { SmartFileEntry } from "./FileEntry";
import { Box } from "@mui/material";
import { VirtuosoGrid, VirtuosoGridHandle } from "react-virtuoso";
import { useContainerQueries } from "use-container-queries";

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

export const GridContainer = React.memo(
  forwardRef<VirtuosoGridHandle, FileListProps>(
    ({ hasNextPage, loadNextPage }, ref) => {
      const viewConfig = useSelector(
        selectFileViewConfig,
      ) as FileViewConfigGrid;

      const displayFileIds = useSelector(selectors.getDisplayFileIds);

      const displayFileIdsRef = useInstanceVariable(displayFileIds);

      const getItemKey = useCallback(
        (index: number) =>
          displayFileIdsRef.current[index] ?? `loading-file-${index}`,
        [displayFileIdsRef],
      );

      const { ref: queryRef, active: breakpoint } = useContainerQueries({
        breakpoints,
      } as any);

      const cellRenderer = useCallback(
        (index: number) => {
          const fileId = displayFileIds[index];
          if (displayFileIds[index] === undefined) return null;

          return (
            <Box sx={{ aspectRatio: "16/11" }}>
              <SmartFileEntry
                fileId={fileId ?? null}
                displayIndex={index}
                fileViewMode={viewConfig.mode}
              />
            </Box>
          );
        },
        [displayFileIds, viewConfig.mode],
      );

      const loadMoreItems = useMemo(
        () => (hasNextPage ? loadNextPage : () => void 0),
        [hasNextPage, loadNextPage],
      );

      const { classes } = useStyles(breakpoint);

      const gridComponent = useMemo(() => {
        return (
          <Box sx={{ width: "100%", height: "100%" }} ref={queryRef}>
            <VirtuosoGrid
              ref={ref}
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
    },
  ),
);

const useStyles = makeStyles<string>()((_, breakpoint) => ({
  gridContainer: {
    display: "grid",
    gap: "8px",
    paddingRight: "16px",
    paddingLeft: "8px",
    gridTemplateColumns: `repeat(${gridsize[breakpoint]}, minmax(180px, 1fr))`,
  },
}));
