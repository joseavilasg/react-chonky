import React from "react";
import { Nullable } from "tsdef";

import { FileData } from "@/types/file.types";
import { makeStyles } from "tss-react/mui";
import {
  useFileNameComponent,
  useModifierIconComponents,
} from "./FileEntry-hooks";

export interface FileEntryNameProps {
  file: Nullable<FileData>;
  className?: string;
  isMobile: boolean;
}

export const FileEntryName: React.FC<FileEntryNameProps> = React.memo(
  ({ file, className, isMobile }) => {
    const modifierIconComponents = useModifierIconComponents(file);
    const fileNameComponent = useFileNameComponent(file);

    const { classes } = useStyles();
    return (
      <span
        className={className}
        title={file && !isMobile ? file.name : undefined}
      >
        {modifierIconComponents.length > 0 && (
          <span className={classes.modifierIcons}>
            {modifierIconComponents}
          </span>
        )}
        {fileNameComponent}
      </span>
    );
  },
);
FileEntryName.displayName = "FileEntryName";

const useStyles = makeStyles()((theme) => ({
  modifierIcons: {
    color: theme.palette.text.primary,
    position: "relative",
    fontSize: "0.775em",
    paddingRight: 5,
  },
}));
