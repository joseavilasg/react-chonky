import React, { useContext, useMemo } from "react";

import { DndEntryState, FileEntryProps } from "@/types/file-list.types";
import { useLocalizedFileEntryStrings } from "@/util/i18n";
import { ChonkyIconContext } from "@/util/icon-helper";
import { TextPlaceholder } from "@/components/external/TextPlaceholder";
import {
  useDndIcon,
  useFileEntryHtmlProps,
  useFileEntryState,
} from "./FileEntry-hooks";
import { FileEntryName } from "./FileEntryName";
import { FileEntryState, useCommonEntryStyles } from "./GridEntryPreview";
import { isMobileDevice } from "./GridContainer";
import { cx } from "@emotion/css";
import { Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";

type StyleState = {
  entryState: FileEntryState;
  dndState: DndEntryState;
};

export const ListEntry: React.FC<FileEntryProps> = React.memo(
  ({ file, selected, focused, dndState }) => {
    const entryState: FileEntryState = useFileEntryState(
      file,
      selected,
      focused,
    );
    const dndIconName = useDndIcon(dndState);

    const { fileModDateString, fileSizeString } =
      useLocalizedFileEntryStrings(file);
    const styleState = useMemo<StyleState>(
      () => ({
        entryState,
        dndState,
      }),
      [dndState, entryState],
    );
    const { classes } = useStyles(styleState);
    const { classes: commonClasses } = useCommonEntryStyles(entryState);
    const ChonkyIcon = useContext(ChonkyIconContext);
    const fileEntryHtmlProps = useFileEntryHtmlProps(file);

    const isMobile = isMobileDevice();

    return (
      <div className={classes.listFileEntry} {...fileEntryHtmlProps}>
        <div
          className={cx([
            commonClasses.selectionIndicator,
            classes.listFileEntrySelection,
          ])}
        ></div>
        <div className={classes.listFileEntryIcon}>
          <ChonkyIcon
            icon={dndIconName ?? entryState.icon}
            spin={dndIconName ? false : entryState.iconSpin}
            fixedWidth={true}
          />
        </div>
        <div className={classes.listFileEntryName}>
          <div
            className={classes.listFileEntryText}
            title={file ? file.name : undefined}
          >
            <FileEntryName file={file} isMobile={isMobile} />
          </div>
          {file?.location && (
            <Typography className={classes.listFileEntryText}>
              {file?.location}
            </Typography>
          )}
        </div>
        <div className={classes.listFileEntryProperty}>
          {file ? (
            fileModDateString ?? <span>—</span>
          ) : (
            <TextPlaceholder minLength={5} maxLength={15} />
          )}
        </div>
        <div className={classes.listFileEntryProperty}>
          {file ? (
            fileSizeString ?? <span>—</span>
          ) : (
            <TextPlaceholder minLength={10} maxLength={20} />
          )}
        </div>
      </div>
    );
  },
);

const useStyles = makeStyles<StyleState>()(
  (theme, { entryState, dndState }) => ({
    listFileEntry: {
      border: "1px solid transparent",
      borderBottomColor: theme.palette.outline.main,
      fontSize: theme.listFileEntry.fontSize,
      color: dndState.dndIsOver
        ? dndState.dndCanDrop
          ? theme.dnd.canDropColor
          : theme.dnd.cannotDropColor
        : "inherit",
      alignItems: "center",
      position: "relative",
      display: "flex",
      height: "100%",
    },
    listFileEntrySelection: {
      opacity: 0.6,
    },
    listFileEntryIcon: {
      color: dndState.dndIsOver
        ? dndState.dndCanDrop
          ? theme.dnd.canDropColor
          : theme.dnd.cannotDropColor
        : entryState.color,
      fontSize: theme.listFileEntry.iconFontSize,
      boxSizing: "border-box",
      padding: [2, 4],
      zIndex: 20,
    },
    listFileEntryName: {
      flex: "1 1 300px",
      paddingLeft: 8,
      zIndex: 20,
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      gap: 4
    },
    listFileEntryText: {
      textOverflow: "ellipsis",
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      overflow: "hidden",
      fontSize: theme.listFileEntry.fontSize,
    },
    listFileEntryProperty: {
      fontSize: theme.listFileEntry.propertyFontSize,
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      overflow: "hidden",
      flex: "0 1 150px",
      padding: [2, 8],
      zIndex: 20,
    },
  }),
);
