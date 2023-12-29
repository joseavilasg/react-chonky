import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React, { ReactElement, useMemo } from "react";

import { ChonkyActions } from "@/action-definitions/index";
import { useFolderChainItems } from "./FileNavbar-hooks";
import { FolderChainButton } from "./FolderChainButton";
import { SmartToolbarButton } from "./ToolbarButton";
import { makeStyles } from "tss-react/mui";

export interface FileNavbarProps {}

export const FileNavbar: React.FC<FileNavbarProps> = React.memo(() => {
  const { classes } = useStyles();
  const folderChainItems = useFolderChainItems();

  const folderChainComponents = useMemo(() => {
    const components: ReactElement[] = [];
    for (let i = 0; i < folderChainItems.length; ++i) {
      const key = `folder-chain-${i}`;
      const component = (
        <FolderChainButton
          key={key}
          first={i === 0}
          current={i === folderChainItems.length - 1}
          item={folderChainItems[i]}
        />
      );
      components.push(component);
    }
    return components;
  }, [folderChainItems]);

  return (
    <Box className={classes.navbarWrapper}>
      <Box className={classes.navbarContainer}>
        <SmartToolbarButton fileActionId={ChonkyActions.OpenParentFolder.id} />
        <Breadcrumbs
          className={classes.navbarBreadcrumbs}
          classes={{ separator: classes.separator }}
        >
          {folderChainComponents}
        </Breadcrumbs>
      </Box>
    </Box>
  );
});

const useStyles = makeStyles()((theme) => ({
  navbarWrapper: {
    paddingBottom: theme.margins.rootLayoutMargin,
  },
  navbarContainer: {
    display: "flex",
  },
  upDirectoryButton: {
    fontSize: theme.toolbar.fontSize,
    height: theme.toolbar.size,
    width: theme.toolbar.size,
    padding: 0,
  },
  navbarBreadcrumbs: {
    fontSize: theme.toolbar.fontSize,
    flexGrow: 100,
  },
  separator: {
    marginRight: 4,
    marginLeft: 4,
  },
}));
