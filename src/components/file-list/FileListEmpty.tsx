import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { ChonkyIconName } from "@/types/icons.types";
import { getI18nId, I18nNamespace } from "@/util/i18n";
import { ChonkyIconContext } from "@/util/icon-helper";
import { makeStyles } from "tss-react/mui";
import { Box } from "@mui/material";

export interface FileListEmptyProps {
  height: number;
}

export const FileListEmpty: React.FC<FileListEmptyProps> = (props) => {
  const { height } = props;
  const { classes } = useStyles();
  const ChonkyIcon = useContext(ChonkyIconContext);

  const intl = useIntl();
  const emptyString = intl.formatMessage({
    id: getI18nId(I18nNamespace.FileList, "nothingToShow"),
    defaultMessage: "Nothing to show",
  });

  return (
    <Box className={classes.fileListEmpty} sx={{ height, width: "100%" }}>
      <div className={classes.fileListEmptyContent}>
        <ChonkyIcon icon={ChonkyIconName.folderOpen} />
        &nbsp; {emptyString}
      </div>
    </Box>
  );
};

const useStyles = makeStyles()((theme) => ({
  fileListEmpty: {
    color: theme.palette.text.disabled,
    position: "relative",
    textAlign: "center",
    fontSize: "1.2em",
  },
  fileListEmptyContent: {
    transform: "translateX(-50%) translateY(-50%)",
    position: "absolute",
    left: "50%",
    top: "50%",
  },
}));
