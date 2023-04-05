import { ChonkyActions } from '../action-definitions/index';
import { ChonkyIconPlaceholder } from '../components/internal/ChonkyIconPlaceholder';
import { FileBrowserProps } from '../types/file-browser.types';
import {DEFAULT_M3_THEME_SCHEME} from '@bhunter179/react-material-you-theme';

export type ChonkyConfig = Pick<
  FileBrowserProps,
  | 'fileActions'
  | 'onFileAction'
  | 'thumbnailGenerator'
  | 'doubleClickDelay'
  | 'disableSelection'
  | 'disableDefaultFileActions'
  | 'hideToolbarInfo'
  | 'forceEnableOpenParent'
  | 'disableDragAndDrop'
  | 'disableDragAndDropProvider'
  | 'defaultSortActionId'
  | 'defaultFileViewActionId'
  | 'clearSelectionOnOutsideClick'
  | 'iconComponent'
  | 'i18n'
  | 'themeScheme'
  | 'themeMode'
>;

export const defaultConfig: ChonkyConfig = {
  fileActions: null,
  onFileAction: null,
  thumbnailGenerator: null,
  doubleClickDelay: 300,
  disableSelection: false,
  disableDefaultFileActions: false,
  forceEnableOpenParent: false,
  hideToolbarInfo: false,
  disableDragAndDrop: false,
  disableDragAndDropProvider: false,
  defaultSortActionId: ChonkyActions.SortFilesByName.id,
  defaultFileViewActionId: ChonkyActions.EnableListView.id,
  clearSelectionOnOutsideClick: true,
  iconComponent: ChonkyIconPlaceholder,
  i18n: {},
  themeScheme: DEFAULT_M3_THEME_SCHEME,
  themeMode: "dark"
};

export const setChonkyDefaults = (config: Partial<ChonkyConfig>) => {
  for (const key of Object.keys(defaultConfig)) {
    if (key in config) {
      defaultConfig[key as keyof ChonkyConfig] = config[key as keyof ChonkyConfig] as any;
    }
  }
};
