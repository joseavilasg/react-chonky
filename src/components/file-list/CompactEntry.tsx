import React, { useContext } from "react";

import { FileEntryProps } from "@/types/file-list.types";
import { useLocalizedFileEntryStrings } from "@/util/i18n";
import { ChonkyIconContext } from "@/util/icon-helper";
import { makeStyles } from "tss-react/mui";
import { TextPlaceholder } from "@/components/external/TextPlaceholder";
import { useFileEntryHtmlProps, useFileEntryState } from "./FileEntry-hooks";
import { FileEntryName } from "./FileEntryName";
import { FileEntryState } from "./GridEntryPreview";
import { isMobileDevice } from "./GridContainer";

export const CompactEntry: React.FC<FileEntryProps> = React.memo(
  // @ts-ignore
  ({ file, selected, focused, dndState }) => {
    const entryState: FileEntryState = useFileEntryState(
      file,
      selected,
      focused,
    );

    const { fileModDateString, fileSizeString } =
      useLocalizedFileEntryStrings(file);

    const { classes } = useStyles(entryState);
    const ChonkyIcon = useContext(ChonkyIconContext);
    const fileEntryHtmlProps = useFileEntryHtmlProps(file);
    const isMobile = isMobileDevice();

    return (
      <div className={classes.listFileEntry} {...fileEntryHtmlProps}>
        <div className={classes.listFileEntryIcon}>
          <ChonkyIcon
            icon={entryState.icon}
            spin={entryState.iconSpin}
            fixedWidth={true}
          />
        </div>
        <div className={classes.listFileEntryDescription}>
          <div
            className={classes.listFileEntryName}
            title={file ? file.name : undefined}
          >
            <FileEntryName file={file} isMobile={isMobile} />
          </div>
          <div className={classes.listFileEntryProperties}>
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
        </div>
        <div className="chonky-file-entry-outline"></div>
        <div className="chonky-file-entry-selection"></div>
      </div>
    );
  },
);

const useStyles = makeStyles<FileEntryState>()((theme, state) => ({
  listFileEntry: {
    fontSize: theme.listFileEntry.fontSize,
    alignItems: "center",
    position: "relative",
    display: "flex",
    height: "100%",
  },
  listFileEntryIcon: {
    backgroundColor: state.color,
    boxShadow: "inset rgba(255, 255, 255, 0.5) 0 0 0 999px",
    borderRadius: theme.listFileEntry.iconBorderRadius,
    fontSize: theme.listFileEntry.iconFontSize,
    color: "#fff",
    padding: 8,
  },
  listFileEntryDescription: {
    flexDirection: "column",
    display: "flex",
    flexGrow: 1,
  },
  listFileEntryName: {
    padding: [0, 8, 4, 8],
  },
  listFileEntryProperties: {
    fontSize: theme.listFileEntry.propertyFontSize,
    flexDirection: "row",
    display: "flex",
  },
  listFileEntryProperty: {
    padding: [0, 8],
    opacity: 0.4,
  },
}));
