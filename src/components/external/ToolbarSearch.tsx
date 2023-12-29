import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import { reduxActions } from "@/redux/reducers";
import { selectSearchString } from "@/redux/selectors";
import { ChonkyIconName } from "@/types/icons.types";
import { useDebounce } from "@/util/hooks-helpers";
import { getI18nId, I18nNamespace } from "@/util/i18n";
import { ChonkyIconContext } from "@/util/icon-helper";
import { ChonkyDispatch } from "@/types/redux.types";
import { makeStyles } from "tss-react/mui";

export interface ToolbarSearchProps {}

export const ToolbarSearch: React.FC<ToolbarSearchProps> = React.memo(() => {
  const intl = useIntl();
  const searchPlaceholderString = intl.formatMessage({
    id: getI18nId(I18nNamespace.Toolbar, "searchPlaceholder"),
    defaultMessage: "Search",
  });

  const { classes } = useStyles();
  const ChonkyIcon = useContext(ChonkyIconContext);

  const searchInputRef = useRef<HTMLInputElement>();

  const dispatch: ChonkyDispatch = useDispatch();
  const reduxSearchString = useSelector(selectSearchString);

  const [localSearchString, setLocalSearchString] = useState(reduxSearchString);
  const [debouncedLocalSearchString] = useDebounce(localSearchString, 50);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  useEffect(() => {
    dispatch(
      reduxActions.setFocusSearchInput(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }),
    );
    return () => {
      dispatch(reduxActions.setFocusSearchInput(null));
    };
  }, [dispatch]);

  useEffect(() => {
    setShowLoadingIndicator(false);
    dispatch(reduxActions.setSearchString(debouncedLocalSearchString));
  }, [debouncedLocalSearchString, dispatch]);

  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setShowLoadingIndicator(true);
      setLocalSearchString(event.currentTarget.value);
    },
    [],
  );
  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Remove focus from the search input field when user presses escape.
      // Note: We use KeyUp instead of KeyPress because some browser plugins can
      //       intercept KeyPress events with Escape key.
      //       @see https://stackoverflow.com/a/37461974
      if (event.key === "Escape") {
        setLocalSearchString("");
        dispatch(reduxActions.setSearchString(""));
        if (searchInputRef.current) searchInputRef.current.blur();
      }
    },
    [dispatch],
  );

  return (
    <TextField
      className={classes.searchFieldContainer}
      size="small"
      variant="outlined"
      value={localSearchString}
      placeholder={searchPlaceholderString}
      onChange={handleChange as any}
      inputRef={searchInputRef}
      InputProps={{
        onKeyUp: handleKeyUp,
        startAdornment: (
          <InputAdornment className={classes.searchIcon} position="start">
            <ChonkyIcon
              icon={
                showLoadingIndicator
                  ? ChonkyIconName.loading
                  : ChonkyIconName.search
              }
              spin={showLoadingIndicator}
            />
          </InputAdornment>
        ),
        className: classes.searchFieldInput,
      }}
      inputProps={{ className: classes.searchFieldInputInner }}
    />
  );
});

const useStyles = makeStyles()((theme) => ({
  searchFieldContainer: {
    height: theme.toolbar.size,
    width: 150,
  },
  searchIcon: {
    fontSize: "0.9em",
    opacity: 0.75,
  },
  searchFieldInput: {
    lineHeight: 0,
    padding: 0,
    margin: 0,
    fontSize: theme.toolbar.fontSize,
    borderRadius: theme.toolbar.buttonRadius,
    height: theme.toolbar.size - 4,
    paddingLeft: 8,
    marginTop: 2,
  },
  searchFieldInputInner: {
    lineHeight: theme.toolbar.size - 4,
    fontSize: theme.toolbar.fontSize,
    height: theme.toolbar.size - 4,
    padding: 0,
    paddingRight: 8,
    margin: 0,
    WebkitAppearance: "none",
  },
}));
