import React, { ReactNode, useMemo, FC } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import shortid from 'shortid';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { deepmerge } from "@mui/utils";
import { CssBaseline,useMediaQuery } from "@mui/material";
import { useChonkyStore } from '../../redux/store';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { defaultConfig } from '../../util/default-config';
import { getValueOrFallback } from '../../util/helpers';
import { useStaticValue } from '../../util/hooks-helpers';
import { ChonkyFormattersContext, defaultFormatters } from '../../util/i18n';
import { ChonkyIconContext } from '../../util/icon-helper';
import { darkThemeOverride, lightTheme, mobileThemeOverride } from '../../util/styles';
import { ChonkyBusinessLogic } from '../internal/ChonkyBusinessLogic';
import { ChonkyIconPlaceholder } from '../internal/ChonkyIconPlaceholder';
import { ChonkyPresentationLayer } from '../internal/ChonkyPresentationLayer';
import {M3ThemeMode,getDesignTokens,getThemedComponents,generateThemeScheme} from '@bhunter179/react-material-you-theme';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';
import { Theme as MuiTheme } from '@mui/material/styles';
import { DeepPartial } from 'tsdef';

const cache = createCache({
  key: 'css',
  prepend: true,
});

export const useChonkyTheme = (themeMode = defaultConfig.themeMode as M3ThemeMode,
  themeColor = defaultConfig.themeColor, themeOverride: MuiTheme) => {

  const themeScheme = generateThemeScheme(themeColor as string)
  const designTokens = getDesignTokens(themeMode, themeScheme[themeMode], themeScheme.tones);
  let newM3Theme = createTheme(designTokens);
  newM3Theme = deepmerge(newM3Theme, getThemedComponents(newM3Theme));

  const isMobileBreakpoint = useMediaQuery('(max-width:480px)');

  const combinedTheme = deepmerge(
    newM3Theme,
    deepmerge(deepmerge(lightTheme, themeMode == 'dark' ? darkThemeOverride : {}), themeOverride || {}),
  );

  const theme = useMemo(() => isMobileBreakpoint ? deepmerge(combinedTheme, mobileThemeOverride) : combinedTheme
    , [themeMode, themeScheme, isMobileBreakpoint])

  return theme

}

export const ChonkywithStore: FC<{ children: ReactNode, instanceId?: string }> = ({ children, instanceId }) => {

  const chonkyInstanceId = useStaticValue(() => instanceId ?? shortid.generate());

  const store = useChonkyStore(chonkyInstanceId);

  return (
    <ReduxProvider store={store}>
      {children}
    </ReduxProvider>
  )

}

export const ChonkywithTheme: FC<{
  children: ReactNode, themeMode?: M3ThemeMode, themeColor?: string,
  overrideTheme?: DeepPartial<MuiTheme>, emotionCache?: EmotionCache
}>
  = ({ children, themeMode, themeColor, overrideTheme, emotionCache }) => {

    const theme = useChonkyTheme(themeMode, themeColor, overrideTheme as MuiTheme)
    return (
      <CacheProvider value={emotionCache ?? cache}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          {children}
        </MuiThemeProvider>
      </CacheProvider>
    )

  }

export const FileBrowser = React.forwardRef<FileBrowserHandle, FileBrowserProps & { children?: ReactNode }>(
  (props, ref) => {
    const { instanceId, iconComponent, children } = props;
    const disableDragAndDrop = getValueOrFallback(
      props.disableDragAndDrop,
      defaultConfig.disableDragAndDrop,
      'boolean',
    );
    const disableDragAndDropProvider = getValueOrFallback(
      props.disableDragAndDropProvider,
      defaultConfig.disableDragAndDropProvider,
      'boolean',
    );

    const i18n = getValueOrFallback(props.i18n, defaultConfig.i18n);
    const formatters = useMemo(() => ({ ...defaultFormatters, ...i18n?.formatters }), [i18n]);
    const useThemeProvider = getValueOrFallback(props.useThemeProvider, true)
    const useStoreProvider = getValueOrFallback(props.useStoreProvider, true)

    const chonkyComps = (
      <>
        <ChonkyBusinessLogic ref={ref} {...props} />
        <ChonkyPresentationLayer>{children}</ChonkyPresentationLayer>
      </>
    );

    const chonkyMain = (
      <ChonkyIconContext.Provider
        value={iconComponent ?? defaultConfig.iconComponent ?? ChonkyIconPlaceholder}
      >
        {disableDragAndDrop || disableDragAndDropProvider ? (
          chonkyComps
        ) : (
          <DndProvider backend={HTML5Backend}>{chonkyComps}</DndProvider>
        )}
      </ChonkyIconContext.Provider>
    )


    return (
      <IntlProvider locale="en" defaultLocale="en" {...i18n}>
        <ChonkyFormattersContext.Provider value={formatters}>
          {useStoreProvider && !useThemeProvider && (
            <ChonkywithStore instanceId={instanceId}>
              {chonkyMain}
            </ChonkywithStore>
          )}
          {useThemeProvider && !useStoreProvider && (
            <ChonkywithTheme themeColor={props.themeColor} themeMode={props.themeMode}
              overrideTheme={props.theme}>
              {chonkyMain}
            </ChonkywithTheme>
          )}

          {useThemeProvider && useStoreProvider && (
            <ChonkywithStore instanceId={instanceId}>
              <ChonkywithTheme themeColor={props.themeColor} themeMode={props.themeMode}
                overrideTheme={props.theme}>
                {chonkyMain}
              </ChonkywithTheme>
            </ChonkywithStore>
          )}

          {!useThemeProvider && !useStoreProvider && (
            <>
              {chonkyMain}
            </>
          )}
        </ChonkyFormattersContext.Provider>
      </IntlProvider>
    );
  },
);
FileBrowser.displayName = 'FileBrowser';
