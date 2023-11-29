import React, { ReactNode, useMemo, FC } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import shortid from 'shortid';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { CssBaseline, ThemeOptions, useMediaQuery } from '@mui/material';
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
import {
    generateDesignTokens,
    getMUIComponents,
    ThemeMode,
    generatePalette,
    getMUIPalette,
} from '@bhunter179/react-material-you-theme';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';
import { DeepPartial } from 'tsdef';

const cache = createCache({
    key: 'css',
    prepend: true,
});

const getTheme = (
    themeMode: ThemeMode,
    themeColor: string,
    themeOverrides?: DeepPartial<ThemeOptions>
) => {
    const tonalPalette = generatePalette(themeColor);
    const themeScheme = {
        light: generateDesignTokens('light', tonalPalette),
        dark: generateDesignTokens('dark', tonalPalette),
        tones: tonalPalette,
    };
    let newM3Theme = createTheme(getMUIPalette(themeMode, themeScheme));
    newM3Theme = deepmerge(newM3Theme, getMUIComponents(newM3Theme));
    return deepmerge(
        newM3Theme,
        deepmerge(
            deepmerge(lightTheme, themeMode == 'dark' ? darkThemeOverride : {}),
            themeOverrides || {}
        )
    );
};

export const useChonkyTheme = (
    themeMode = defaultConfig.themeMode as ThemeMode,
    themeColor = defaultConfig.themeColor,
    themeOverrides?: DeepPartial<ThemeOptions>
) => {
    const isMobileBreakpoint = useMediaQuery('(max-width:480px)');

    const theme = useMemo(() => {
        const combinedTheme = getTheme(themeMode, themeColor as string, themeOverrides);
        return isMobileBreakpoint
            ? deepmerge(combinedTheme, mobileThemeOverride)
            : combinedTheme;
    }, [isMobileBreakpoint, themeMode, themeColor]);

    return theme;
};

export const ChonkywithStore: FC<{ children: ReactNode; instanceId?: string }> = ({
    children,
    instanceId,
}) => {
    const chonkyInstanceId = useStaticValue(() => instanceId ?? shortid.generate());

    const store = useChonkyStore(chonkyInstanceId);

    return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export const ChonkywithTheme: FC<{
    children: ReactNode;
    themeMode?: ThemeMode;
    themeColor?: string;
    themeOverrides?: DeepPartial<ThemeOptions>;
    emotionCache?: EmotionCache;
}> = ({ children, themeMode, themeColor, themeOverrides, emotionCache }) => {
    const theme = useChonkyTheme(themeMode, themeColor, themeOverrides);
    return (
        <CacheProvider value={emotionCache ?? cache}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </MuiThemeProvider>
        </CacheProvider>
    );
};

export const FileBrowser = React.forwardRef<
    FileBrowserHandle,
    FileBrowserProps & { children?: ReactNode }
>((props, ref) => {
    const { instanceId, iconComponent, children } = props;
    const disableDragAndDrop = getValueOrFallback(
        props.disableDragAndDrop,
        defaultConfig.disableDragAndDrop,
        'boolean'
    );
    const disableDragAndDropProvider = getValueOrFallback(
        props.disableDragAndDropProvider,
        defaultConfig.disableDragAndDropProvider,
        'boolean'
    );

    const i18n = getValueOrFallback(props.i18n, defaultConfig.i18n);
    const formatters = useMemo(
        () => ({ ...defaultFormatters, ...i18n?.formatters }),
        [i18n]
    );
    const useThemeProvider = getValueOrFallback(props.useThemeProvider, true);
    const useStoreProvider = getValueOrFallback(props.useStoreProvider, true);

    const chonkyComps = (
        <>
            <ChonkyBusinessLogic ref={ref} {...props} />
            <ChonkyPresentationLayer>{children}</ChonkyPresentationLayer>
        </>
    );

    const chonkyMain = (
        <ChonkyIconContext.Provider
            value={
                iconComponent ?? defaultConfig.iconComponent ?? ChonkyIconPlaceholder
            }
        >
            {disableDragAndDrop || disableDragAndDropProvider ? (
                chonkyComps
            ) : (
                <DndProvider backend={HTML5Backend}>{chonkyComps}</DndProvider>
            )}
        </ChonkyIconContext.Provider>
    );

    return (
        <IntlProvider locale="en" defaultLocale="en" {...i18n}>
            <ChonkyFormattersContext.Provider value={formatters}>
                {useStoreProvider && !useThemeProvider && (
                    <ChonkywithStore instanceId={instanceId}>
                        {chonkyMain}
                    </ChonkywithStore>
                )}
                {useThemeProvider && !useStoreProvider && (
                    <ChonkywithTheme
                        themeColor={props.themeColor}
                        themeMode={props.themeMode}
                        themeOverrides={props.themeOverrides}
                    >
                        {chonkyMain}
                    </ChonkywithTheme>
                )}

                {useThemeProvider && useStoreProvider && (
                    <ChonkywithStore instanceId={instanceId}>
                        <ChonkywithTheme
                            themeColor={props.themeColor}
                            themeMode={props.themeMode}
                            themeOverrides={props.themeOverrides}
                        >
                            {chonkyMain}
                        </ChonkywithTheme>
                    </ChonkywithStore>
                )}

                {!useThemeProvider && !useStoreProvider && <>{chonkyMain}</>}
            </ChonkyFormattersContext.Provider>
        </IntlProvider>
    );
});
FileBrowser.displayName = 'FileBrowser';
