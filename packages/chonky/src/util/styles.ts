import { Theme as MuiTheme } from '@mui/material/styles';
import { DeepPartial } from 'tsdef';
import { makeStyles } from "tss-react/mui";

export const lightTheme = {
  colors: {
    debugRed: '#fabdbd',
    debugBlue: '#bdd8fa',
    debugGreen: '#d2fabd',
    debugPurple: '#d2bdfa',
    debugYellow: '#fae9bd',

    textActive: '#09f',
  },

  fontSizes: {
    rootPrimary: 15,
  },

  margins: {
    rootLayoutMargin: 8,
  },

  root: {
    borderRadius: 4,
    borderStyle: 'solid 1px',
    height: '100%',
  },

  toolbar: {
    size: 30,
    lineHeight: '30px', // `px` suffix is required for `line-height` fields to work
    buttonPadding: 8,
    fontSize: 15,
    buttonRadius: 4,
  },

  dnd: {
    canDropColor: 'green',
    cannotDropColor: 'red',
    canDropMask: 'rgba(180, 235, 180, 0.75)',
    cannotDropMask: 'rgba(235, 180, 180, 0.75)',
    fileListCanDropMaskOne: 'rgba(180, 235, 180, 0.1)',
    fileListCanDropMaskTwo: 'rgba(180, 235, 180, 0.2)',
    fileListCannotDropMaskOne: 'rgba(235, 180, 180, 0.1)',
    fileListCannotDropMaskTwo: 'rgba(235, 180, 180, 0.2)',
  },

  dragLayer: {
    border: 'solid 2px #09f',
    padding: '7px 10px',
    borderRadius: 2,
  },

  fileList: {
    desktopGridGutter: 8,
    mobileGridGutter: 5,
  },

  gridFileEntry: {
    childrenCountSize: '1.6em',
    iconColorFocused: '#000',
    iconSize: '2.4em',
    iconColor: '#fff',
    borderRadius: 5,
    fontSize: 14,

    fileColorTint: 'rgba(255, 255, 255, 0.4)',
    folderBackColorTint: 'rgba(255, 255, 255, 0.1)',
    folderFrontColorTint: 'rgba(255, 255, 255, 0.4)',
  },

  listFileEntry: {
    propertyFontSize: 16,
    iconFontSize: '1.1em',
    iconBorderRadius: 5,
    fontSize: 16,
  },
};


interface Colors {
  debugRed: string
  debugBlue: string
  debugGreen: string
  debugPurple: string
  debugYellow: string
  textActive: string
}

interface FontSizes {
  rootPrimary: number
}

interface Margins {
  rootLayoutMargin: number
}

interface Root2 {
  borderRadius: number
  borderStyle: string
  height: string
}

interface Toolbar {
  size: number
  lineHeight: string
  buttonPadding: number
  fontSize: number
  buttonRadius: number
}

interface Dnd {
  canDropColor: string
  cannotDropColor: string
  canDropMask: string
  cannotDropMask: string
  fileListCanDropMaskOne: string
  fileListCanDropMaskTwo: string
  fileListCannotDropMaskOne: string
  fileListCannotDropMaskTwo: string
}

interface DragLayer {
  border: string
  padding: string
  borderRadius: number
}

interface FileList {
  desktopGridGutter: number
  mobileGridGutter: number
}

interface GridFileEntry {
  childrenCountSize: string
  iconColorFocused: string
  iconSize: string
  iconColor: string
  borderRadius: number
  fontSize: number
  fileColorTint: string
  folderBackColorTint: string
  folderFrontColorTint: string
}

interface ListFileEntry {
  propertyFontSize: number
  iconFontSize: string
  iconBorderRadius: number
  fontSize: number
}

declare module '@mui/material/styles/createTheme' {
  interface ThemeOptions {
    colors: Colors
    fontSizes: FontSizes
    margins: Margins
    root: Root2
    toolbar: Toolbar
    dnd: Dnd
    dragLayer: DragLayer
    fileList: FileList
    gridFileEntry: GridFileEntry
    listFileEntry: ListFileEntry

  }
  interface Theme {
    colors: Colors
    fontSizes: FontSizes
    margins: Margins
    root: Root2
    toolbar: Toolbar
    dnd: Dnd
    dragLayer: DragLayer
    fileList: FileList
    gridFileEntry: GridFileEntry
    listFileEntry: ListFileEntry
  }
}

export const darkThemeOverride: DeepPartial<MuiTheme> = {
  gridFileEntry: {
    fileColorTint: 'rgba(50, 50, 50, 0.4)',
    folderBackColorTint: 'rgba(50, 50, 50, 0.4)',
    folderFrontColorTint: 'rgba(50, 50, 50, 0.15)',
  },
};

export const mobileThemeOverride: DeepPartial<MuiTheme> = {
  fontSizes: {
    rootPrimary: 13,
  },
  margins: {
    rootLayoutMargin: 4,
  },
  toolbar: {
    size: 28,
    lineHeight: '28px',
    fontSize: 13,
  },
  gridFileEntry: {
    fontSize: 13,
  },
  listFileEntry: {
    propertyFontSize: 12,
    iconFontSize: '1em',
    fontSize: 13,
  },
};


export const getStripeGradient = (colorOne: string, colorTwo: string) =>
  'repeating-linear-gradient(' +
  '45deg,' +
  `${colorOne},` +
  `${colorOne} 10px,` +
  `${colorTwo} 0,` +
  `${colorTwo} 20px` +
  ')';

export const makeLocalChonkyStyles = (
  styles: (theme: MuiTheme, props: any) => any,
  // @ts-ignore
): any => {
  const useStyles = makeStyles<any>()(
    (theme, props) => styles(theme, props)
  )

  return useStyles
}


export const important = <T>(value: T) => `${value} !important`;
