import React, {
  useCallback,
  useContext,
  useMemo,
  forwardRef,
  memo,
  Ref,
} from "react";
import { useSelector } from "react-redux";
import { ChonkyActions } from "@/action-definitions/index";
import {
  selectCurrentFolder,
  selectFileViewConfig,
  selectors,
} from "@/redux/selectors";
import { FileViewMode } from "@/types/file-view.types";
import { FileListProps } from "@/types/file-list.types";
import { ChonkyIconName } from "@/types/icons.types";
import { useFileDrop } from "@/util/dnd";
import { ChonkyIconContext } from "@/util/icon-helper";
import { getStripeGradient } from "@/util/styles";
import { FileListEmpty } from "./FileListEmpty";
import { GridContainer } from "./GridContainer";
import { ListContainer } from "./ListContainer";
import { VirtuosoHandle, VirtuosoGridHandle } from "react-virtuoso";
import { makeStyles } from "tss-react/mui";

interface StyleState {
  dndCanDrop: boolean;
  dndIsOverCurrent: boolean;
}

export const FileList = memo(
  forwardRef<unknown, FileListProps>((props, ref) => {
    const displayFileIds = useSelector(selectors.getDisplayFileIds);
    const viewConfig = useSelector(selectFileViewConfig);

    const currentFolder = useSelector(selectCurrentFolder);
    const { drop, dndCanDrop, dndIsOverCurrent } = useFileDrop({
      file: currentFolder,
    });
    const styleState = useMemo<StyleState>(
      () => ({ dndCanDrop, dndIsOverCurrent }),
      [dndCanDrop, dndIsOverCurrent],
    );

    const { classes: localClasses } = useLocalStyles(styleState);

    const listRenderer = useCallback(() => {
      if (displayFileIds.length === 0) {
        return <FileListEmpty height={viewConfig.entryHeight} />;
      } else if (viewConfig.mode === FileViewMode.List) {
        return <ListContainer ref={ref as Ref<VirtuosoHandle>} {...props} />;
      } else {
        return (
          <GridContainer ref={ref as Ref<VirtuosoGridHandle>} {...props} />
        );
      }
    }, [displayFileIds, viewConfig]);

    const ChonkyIcon = useContext(ChonkyIconContext);
    return (
      <div ref={drop} className={localClasses.fileListWrapper}>
        <div className={localClasses.dndDropZone}>
          <div className={localClasses.dndDropZoneIcon}>
            <ChonkyIcon
              icon={
                dndCanDrop
                  ? ChonkyIconName.dndCanDrop
                  : ChonkyIconName.dndCannotDrop
              }
            />
          </div>
        </div>
        {listRenderer()}
      </div>
    );
  }),
);
FileList.displayName = "FileList";

const useLocalStyles = makeStyles<StyleState>()((theme, state) => ({
  fileListWrapper: {
    minHeight: ChonkyActions.EnableGridView.fileViewConfig.entryHeight + 2,
    background:
      state.dndIsOverCurrent && state.dndCanDrop
        ? state.dndCanDrop
          ? getStripeGradient(
              theme.dnd.fileListCanDropMaskOne,
              theme.dnd.fileListCanDropMaskTwo,
            )
          : getStripeGradient(
              theme.dnd.fileListCannotDropMaskOne,
              theme.dnd.fileListCannotDropMaskTwo,
            )
        : "none",
    height: "100%",
    maxHeight: "100%",
  },
  dndDropZone: {
    display:
      // When we cannot drop, we don't show an indicator at all
      state.dndIsOverCurrent && state.dndCanDrop ? "block" : "none",
    borderRadius: theme.gridFileEntry.borderRadius,
    pointerEvents: "none",
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 2,
  },
  dndDropZoneIcon: {
    backgroundColor: state.dndCanDrop
      ? theme.dnd.canDropMask
      : theme.dnd.cannotDropMask,
    color: state.dndCanDrop
      ? theme.dnd.canDropColor
      : theme.dnd.cannotDropColor,
    borderRadius: theme.gridFileEntry.borderRadius,
    transform: "translateX(-50%) translateY(-50%)",
    position: "absolute",
    textAlign: "center",
    lineHeight: "60px",
    fontSize: "2em",
    left: "50%",
    height: 60,
    top: "50%",
    width: 60,
  },
}));
