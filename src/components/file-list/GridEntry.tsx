import React from "react";

import { FileEntryProps } from "@/types/file-list.types";
import { FileHelper } from "@/util/file-helper";
import { makeStyles } from "tss-react/mui";
import { useFileEntryHtmlProps, useFileEntryState } from "./FileEntry-hooks";
import { FileEntryName } from "./FileEntryName";
import {
  FileEntryState,
  GridEntryPreviewFile,
  GridEntryPreviewFolder,
} from "./GridEntryPreview";
import { isMobileDevice } from "./GridContainer";
import { cx } from "@emotion/css";

export const GridEntry: React.FC<FileEntryProps> = React.memo(
  ({ file, selected, focused, dndState }) => {
    const isDirectory = FileHelper.isDirectory(file);
    const entryState = useFileEntryState(file, selected, focused);
    const isMobile = isMobileDevice();
    const { classes } = useFileEntryStyles(entryState);
    const fileEntryHtmlProps = useFileEntryHtmlProps(file);
    const entryClassName = cx({
      [classes.gridFileEntry]: true,
    });
    return (
      <div className={entryClassName} {...fileEntryHtmlProps}>
        {isDirectory ? (
          <GridEntryPreviewFolder
            className={classes.gridFileEntryPreview}
            entryState={entryState}
            dndState={dndState}
          />
        ) : (
          <GridEntryPreviewFile
            className={classes.gridFileEntryPreview}
            entryState={entryState}
            dndState={dndState}
          />
        )}
        <div className={classes.gridFileEntryNameContainer}>
          <FileEntryName
            className={classes.gridFileEntryName}
            file={file}
            isMobile={isMobile}
          />
        </div>
      </div>
    );
  },
);
GridEntry.displayName = "GridEntry";

const useFileEntryStyles = makeStyles<FileEntryState>()((theme, state) => ({
  gridFileEntry: {
    flexDirection: "column",
    display: "flex",
    height: "100%",
    width: "90%",
    margin: "auto",
  },
  gridFileEntryPreview: {
    flexGrow: 1,
  },
  gridFileEntryNameContainer: {
    fontSize: theme.gridFileEntry.fontSize,
    wordBreak: "break-word",
    textAlign: "center",
    paddingTop: 5,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  gridFileEntryName: {
    backgroundColor: state.selected ? "rgba(0,153,255, .25)" : "transparent",
    textDecoration: state.focused ? "underline" : "none",
    borderRadius: 3,
    padding: [2, 4],
  },
}));
