import React from "react";

import {
  FileBrowserHandle,
  FileBrowserProps,
} from "@/types/file-browser.types";
import { FileList } from "@/components/file-list/FileList";
import { FileBrowser } from "./FileBrowser";
import { FileContextMenu } from "./FileContextMenu";
import { FileNavbar } from "./FileNavbar";
import { FileToolbar } from "./FileToolbar";

export const FullFileBrowser = React.memo(
  React.forwardRef<FileBrowserHandle, FileBrowserProps>((props, ref) => {
    return (
      <FileBrowser ref={ref} {...props}>
        {props.folderChain?.length ? <FileNavbar /> : undefined}
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FileBrowser>
    );
  }),
);
FullFileBrowser.displayName = "FullFileBrowser";
