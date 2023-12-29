import React, { useContext, useMemo } from "react";

import { DndEntryState } from "@/types/file-list.types";
import { ChonkyIconName } from "@/types/icons.types";
import { useDndHoverOpen, useFileDrop } from "@/util/dnd";
import { ChonkyIconContext } from "@/util/icon-helper";
import { useDndIcon } from "@/components/file-list/FileEntry-hooks";
import { FolderChainItem } from "./FileNavbar-hooks";
import { ToolbarButton } from "./ToolbarButton";
import { cx } from "@emotion/css";
import { makeStyles } from "tss-react/mui";
import { important } from "@/util/styles";
export interface FolderChainButtonProps {
  first: boolean;
  current: boolean;
  item: FolderChainItem;
}

export const FolderChainButton: React.FC<FolderChainButtonProps> = React.memo(
  ({ first, current, item }) => {
    const { file, disabled, onClick } = item;
    const { dndIsOver, dndCanDrop, drop } = useFileDrop({
      file,
      forceDisableDrop: !file || current,
    });
    const dndState = useMemo<DndEntryState>(
      () => ({
        dndIsOver,
        dndCanDrop,
        dndIsDragging: false,
      }),
      [dndCanDrop, dndIsOver],
    );
    useDndHoverOpen(file, dndState);
    const dndIconName = useDndIcon(dndState);
    const ChonkyIcon = useContext(ChonkyIconContext);

    const { classes } = useStyles(dndState);
    const className = cx({
      [classes.baseBreadcrumb]: true,
      [classes.disabledBreadcrumb]: disabled,
      [classes.currentBreadcrumb]: current,
    });
    const text = file ? file.name : "Loading...";
    const icon =
      first && file?.folderChainIcon === undefined
        ? ChonkyIconName.folder
        : file?.folderChainIcon;

    return (
      <div className={classes.buttonContainer} ref={file ? drop : null}>
        {file && dndIconName && (
          <div className={classes.dndIndicator}>
            <ChonkyIcon icon={dndIconName} fixedWidth={true} />
          </div>
        )}
        <ToolbarButton
          icon={icon}
          className={className}
          text={text}
          disabled={disabled}
          onClick={onClick}
        />
      </div>
    );
  },
);

const useStyles = makeStyles<DndEntryState>()((theme, dndState) => ({
  buttonContainer: {
    position: "relative",
  },
  baseBreadcrumb: {
    color: (() => {
      let color = theme.palette.text.primary;
      if (dndState.dndIsOver) {
        color = dndState.dndCanDrop
          ? theme.dnd.canDropColor
          : theme.dnd.cannotDropColor;
      }
      return important(color);
    })(),
  },
  disabledBreadcrumb: {
    // Constant function here is on purpose. Without the function, the color here
    // does not override the `baseBreadcrumb` color from above.
    color: (() => important(theme.palette.text.disabled))(),
  },
  currentBreadcrumb: {
    textDecoration: "underline",
  },
  dndIndicator: {
    color: dndState.dndCanDrop
      ? theme.dnd.canDropColor
      : theme.dnd.cannotDropColor,
    backgroundColor: dndState.dndCanDrop
      ? theme.dnd.canDropMask
      : theme.dnd.cannotDropMask,
    lineHeight: `calc(${theme.toolbar.lineHeight} - 6px)`,
    transform: "translateX(-50%) translateY(-50%)",
    borderRadius: theme.toolbar.buttonRadius,
    height: theme.toolbar.size - 6,
    width: theme.toolbar.size - 6,
    boxSizing: "border-box",
    position: "absolute",
    textAlign: "center",
    left: "50%",
    top: "50%",
    zIndex: 5,
  },
}));
