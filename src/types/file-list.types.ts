import { Nullable } from "tsdef";

import { FileData } from "./file.types";

import { StateSnapshot } from "react-virtuoso";

export interface DndEntryState {
  dndIsDragging?: boolean;
  dndIsOver?: boolean;
  dndCanDrop?: boolean;
}

export interface FileEntryProps {
  file: Nullable<FileData>;
  selected: boolean;
  focused: boolean;
  dndState: DndEntryState;
}

export interface FileListProps {
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: () => void;
  restoreStateFrom?: StateSnapshot;
}
