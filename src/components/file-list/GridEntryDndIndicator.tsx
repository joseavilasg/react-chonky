import React, { useContext } from "react";

import { DndEntryState } from "@/types/file-list.types";
import { ChonkyIconContext } from "@/util/icon-helper";
import { makeStyles } from "tss-react/mui";
import { useDndIcon } from "./FileEntry-hooks";
import { cx } from "@emotion/css";

export interface DnDIndicatorProps {
  className: string;
  dndState: DndEntryState;
}

export const GridEntryDndIndicator: React.FC<DnDIndicatorProps> = React.memo(
  (props) => {
    const { className: externalClassName, dndState } = props;
    const dndIconName = useDndIcon(dndState);
    const { classes } = useStyles(dndState);
    const ChonkyIcon = useContext(ChonkyIconContext);
    if (!dndIconName) return null;
    const className = cx({
      [classes.dndIndicator]: true,
      [externalClassName]: true,
    });
    return (
      <div className={className}>
        <ChonkyIcon icon={dndIconName} />
      </div>
    );
  },
);

const useStyles = makeStyles<DndEntryState>()((theme, dndState) => ({
  dndIndicator: {
    color: dndState.dndIsOver
      ? dndState.dndCanDrop
        ? theme.dnd.canDropColor
        : theme.dnd.cannotDropColor
      : "#000",
    boxSizing: "border-box",
    position: "absolute",
    fontSize: "1.2em",
    opacity: 0.6,
    padding: 6,
    "&:before": {
      borderBottom: "50px solid transparent",
      borderLeft: "50px solid #fff",
      position: "absolute",
      content: '""',
      zIndex: -1,
      left: 0,
      top: 0,
    },
  },
}));
