import React, { ReactNode, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from 'react-jss';
import { Provider as ReduxProvider } from 'react-redux';
import shortid from 'shortid';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { deepmerge } from "@mui/utils";
import { CssBaseline } from "@mui/material";
import { useChonkyStore } from '../../redux/store';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { defaultConfig } from '../../util/default-config';
import { getValueOrFallback } from '../../util/helpers';
import { useStaticValue } from '../../util/hooks-helpers';
import { ChonkyFormattersContext, defaultFormatters } from '../../util/i18n';
import { ChonkyIconContext } from '../../util/icon-helper';
import { darkThemeOverride, lightTheme, mobileThemeOverride, useIsMobileBreakpoint } from '../../util/styles';
import { ChonkyBusinessLogic } from '../internal/ChonkyBusinessLogic';
import { ChonkyIconPlaceholder } from '../internal/ChonkyIconPlaceholder';
import { ChonkyPresentationLayer } from '../internal/ChonkyPresentationLayer';
import { getDesignTokens, getThemedComponents} from '@bhunter179/react-material-you-theme';

// if (process.env.NODE_ENV === 'development') {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render');
//     whyDidYouRender(React, {
//         trackAllPureComponents: true,
//     });
// }

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

    const themeScheme = getValueOrFallback(props.themeScheme, defaultConfig.themeScheme);
    const themeMode = getValueOrFallback(props.themeMode, defaultConfig.themeMode);
    const i18n = getValueOrFallback(props.i18n, defaultConfig.i18n);
    const formatters = useMemo(() => ({ ...defaultFormatters, ...i18n?.formatters }), [i18n]);

    const chonkyInstanceId = useStaticValue(() => instanceId ?? shortid.generate());
    const store = useChonkyStore(chonkyInstanceId);

    const isMobileBreakpoint = useIsMobileBreakpoint();


    const theme = useMemo(() => {
      const designTokens = getDesignTokens(themeMode, themeScheme[themeMode], themeScheme.tones);
      let newM3Theme = createTheme(designTokens);
      newM3Theme = deepmerge(newM3Theme, getThemedComponents(newM3Theme));

      const combinedTheme = deepmerge(
        newM3Theme,
        deepmerge(deepmerge(lightTheme, themeMode == 'dark' ? darkThemeOverride : {}), props.theme || {}),
      );

      return isMobileBreakpoint ? deepmerge(combinedTheme, mobileThemeOverride) : combinedTheme;

    }, [themeMode, themeScheme, isMobileBreakpoint]);

    const chonkyComps = (
      <>
        <ChonkyBusinessLogic ref={ref} {...props} />
        <ChonkyPresentationLayer>{children}</ChonkyPresentationLayer>
      </>
    );

    return (
      <IntlProvider locale="en" defaultLocale="en" {...i18n}>
        <ChonkyFormattersContext.Provider value={formatters}>
          <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
              <StyledEngineProvider injectFirst>
                <MuiThemeProvider theme={theme}>
                  <CssBaseline enableColorScheme />
                  <ChonkyIconContext.Provider
                    value={iconComponent ?? defaultConfig.iconComponent ?? ChonkyIconPlaceholder}
                  >
                    {disableDragAndDrop || disableDragAndDropProvider ? (
                      chonkyComps
                    ) : (
                      <DndProvider backend={HTML5Backend}>{chonkyComps}</DndProvider>
                    )}
                  </ChonkyIconContext.Provider>
                </MuiThemeProvider>
              </StyledEngineProvider>
            </ThemeProvider>
          </ReduxProvider>
        </ChonkyFormattersContext.Provider>
      </IntlProvider>
    );
  },
);
FileBrowser.displayName = 'FileBrowser';
