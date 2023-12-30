import React, { useContext } from "react";
import { Nullable } from "tsdef";
import { SVGProps } from "react";
import { DndEntryState } from "@/types/file-list.types";
import { ChonkyIconName } from "@/types/icons.types";
import { ChonkyIconContext } from "@/util/icon-helper";
import { FileThumbnail } from "./FileThumbnail";
import { GridEntryDndIndicator } from "./GridEntryDndIndicator";
import { cx } from "@emotion/css";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material";

export type FileEntryState = {
  childrenCount: Nullable<number>;
  color: string;
  icon: ChonkyIconName | string;
  thumbnailUrl: Nullable<string>;
  iconSpin: boolean;
  selected: boolean;
  focused: boolean;
};

export interface FileEntryPreviewProps {
  className?: string;
  entryState: FileEntryState;
  dndState: DndEntryState;
}

const FolderIcon = (props: SVGProps<SVGSVGElement>) => {
  const theme = useTheme();

  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill={theme.palette.onPrimaryContainer.main}
        d="M40 12H22l-4-4H8c-2.2 0-4 1.8-4 4v8h40v-4c0-2.2-1.8-4-4-4z"
      />
      <path
        fill={theme.palette.primary.main}
        d="M40 12H8c-2.2 0-4 1.8-4 4v20c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V16c0-2.2-1.8-4-4-4z"
      />
    </svg>
  );
};

export const GridEntryPreviewFolder: React.FC<FileEntryPreviewProps> =
  React.memo((props) => {
    const { className: externalClassName, entryState, dndState } = props;

    const { classes: folderClasses } = useFolderStyles(entryState);
    const { classes: fileClasses } = useFileStyles(entryState);
    const { classes: commonClasses } = useCommonEntryStyles(entryState);
    const className = cx({
      [folderClasses.previewFile]: true,
      [externalClassName || ""]: !!externalClassName,
    });
    return (
      <div className={className}>
        <GridEntryDndIndicator
          className={fileClasses.dndIndicator}
          dndState={dndState}
        />
        <FolderIcon className={fileClasses.fileIcon} />
        <div className={commonClasses.selectionIndicator}></div>
      </div>
    );
  });
GridEntryPreviewFolder.displayName = "GridEntryPreviewFolder";

const useFolderStyles = makeStyles<FileEntryState>()((theme, state) => ({
  previewFile: {
    boxShadow: (() => {
      const shadows: string[] = [];
      if (state.selected) shadows.push("inset rgba(0,153,255, .65) 0 0 0 3px");
      if (state.focused) shadows.push("inset rgba(0, 0, 0, 1) 0 0 0 3px");
      return shadows.join(", ");
    })(),
    borderRadius: theme.gridFileEntry.borderRadius,
    position: "relative",
    overflow: "hidden",
  },
}));

export const GridEntryPreviewFile: React.FC<FileEntryPreviewProps> = React.memo(
  (props) => {
    const { className: externalClassName, entryState, dndState } = props;

    const { classes: fileClasses } = useFileStyles(entryState);
    const { classes: commonClasses } = useCommonEntryStyles(entryState);
    const ChonkyIcon = useContext(ChonkyIconContext);
    const className = cx({
      [fileClasses.previewFile]: true,
      [externalClassName || ""]: !!externalClassName,
    });
    return (
      <div className={className}>
        <GridEntryDndIndicator
          className={fileClasses.dndIndicator}
          dndState={dndState}
        />
        {!entryState.thumbnailUrl ? (
          <div className={fileClasses.fileIcon}>
            <ChonkyIcon icon={entryState.icon} spin={entryState.iconSpin} />
          </div>
        ) : (
          <FileThumbnail
            className={fileClasses.thumbnail}
            thumbnailUrl={entryState.thumbnailUrl}
          />
        )}
        <div className={commonClasses.selectionIndicator}></div>
      </div>
    );
  },
);
GridEntryPreviewFile.displayName = "GridEntryPreviewFile";

const useFileStyles = makeStyles<FileEntryState>()((theme, state) => ({
  previewFile: {
    boxShadow: (() => {
      const shadows: string[] = [];
      if (state.selected) shadows.push("inset rgba(0,153,255, .65) 0 0 0 3px");
      if (state.focused) shadows.push("inset rgba(0, 0, 0, 1) 0 0 0 3px");
      shadows.push(`inset ${theme.gridFileEntry.fileColorTint} 0 0 0 999px`);
      return shadows.join(", ");
    })(),
    backgroundColor: state.color,
    borderRadius: theme.gridFileEntry.borderRadius,
    position: "relative",
    overflow: "hidden",
  },
  dndIndicator: {
    zIndex: 14,
  },
  fileIcon: {
    transform: "translateX(-50%) translateY(-50%)",
    fontSize: theme.gridFileEntry.iconSize,
    opacity: state.thumbnailUrl && !state.focused ? 0 : 1,
    color: state.focused
      ? theme.gridFileEntry.iconColorFocused
      : theme.gridFileEntry.iconColor,
    position: "absolute",
    left: "50%",
    zIndex: 12,
    top: "50%",
  },
  thumbnail: {
    borderRadius: theme.gridFileEntry.borderRadius,
    position: "absolute",
    zIndex: 6,
    inset: 3,
  },
}));

export const useCommonEntryStyles = makeStyles<FileEntryState>()(
  (_, state) => ({
    selectionIndicator: {
      display: state.selected ? "block" : "none",
      backgroundColor: "rgba(0, 153, 255, .36)",
      position: "absolute",
      height: "100%",
      width: "100%",
      zIndex: 10,
    }
  }),
);
