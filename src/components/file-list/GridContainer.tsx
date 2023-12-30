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

      const { classes } = useStyles();

      const gridComponent = useMemo(() => {
        return (
          <Box sx={{ width: "100%", height: "100%", containerType: "size" }}>
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

const useStyles = makeStyles()(() => ({
  gridContainer: {
    display: "grid",
    gap: "8px",
    paddingRight: "16px",
    paddingLeft: "8px",
    gridTemplateColumns: "repeat(2,minmax(0px,1fr))",
    "@container (max-width: 320px)": {
      gridTemplateColumns: "repeat(1,minmax(0px,1fr))",
    },
    "@container (min-width: 480px) and (max-width: 719px)": {
      gridTemplateColumns: "repeat(3,minmax(0px,1fr))",
    },
    "@container (min-width: 720px) and (max-width: 899px)": {
      gridTemplateColumns: "repeat(4,minmax(0px,1fr))",
    },

    "@container (min-width: 900px) and (max-width: 1199px)": {
      gridTemplateColumns: "repeat(5,minmax(0px,1fr))",
    },

    "@container (min-width: 1200px)": {
      gridTemplateColumns: "repeat(6,minmax(0px,1fr))",
    },
  },
}));
