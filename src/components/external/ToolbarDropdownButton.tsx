import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import React, { useCallback, useContext } from "react";
import { Nullable } from "tsdef";

import { selectFileActionData } from "@/redux/selectors";
import { useParamSelector } from "@/redux/store";
import { ChonkyIconName } from "@/types/icons.types";
import { CustomVisibilityState } from "@/types/action.types";
import { useFileActionProps, useFileActionTrigger } from "@/util/file-actions";
import { useLocalizedFileActionStrings } from "@/util/i18n";
import { ChonkyIconContext } from "@/util/icon-helper";
import { cx } from "@emotion/css";
import { makeStyles } from "tss-react/mui";
import { important } from "@/util/styles";
export interface ToolbarDropdownButtonProps {
  text: string;
  active?: boolean;
  icon?: Nullable<ChonkyIconName | string>;
  onClick?: () => void;
  disabled?: boolean;
}

export const ToolbarDropdownButton = React.forwardRef(
  (props: ToolbarDropdownButtonProps, ref: React.Ref<HTMLLIElement>) => {
    const { text, active, icon, onClick, disabled } = props;
    const { classes } = useStyles();
    const ChonkyIcon = useContext(ChonkyIconContext);

    const className = cx({
      [classes.baseButton]: true,
      [classes.activeButton]: active,
    });
    return (
      <MenuItem
        ref={ref}
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {icon && (
          <ListItemIcon className={classes.icon}>
            <ChonkyIcon icon={icon} fixedWidth={true} />
          </ListItemIcon>
        )}
        <ListItemText primaryTypographyProps={{ className: classes.text }}>
          {text}
        </ListItemText>
      </MenuItem>
    );
  },
);

const useStyles = makeStyles()((theme) => ({
  baseButton: {
    lineHeight: theme.toolbar.lineHeight,
    height: theme.toolbar.size,
    minHeight: "auto",
    minWidth: "auto",
    padding: theme.toolbar.buttonPadding,
  },
  icon: {
    fontSize: theme.toolbar.fontSize,
    minWidth: "auto",
    color: "inherit",
    marginRight: 8,
  },
  text: {
    fontSize: theme.toolbar.fontSize,
  },
  activeButton: {
    color: important(theme.palette.primary.main),
  },
}));

export interface SmartToolbarDropdownButtonProps {
  fileActionId: string;
  onClickFollowUp?: () => void;
}

export const SmartToolbarDropdownButton = React.forwardRef(
  (props: SmartToolbarDropdownButtonProps, ref: React.Ref<HTMLLIElement>) => {
    const { fileActionId, onClickFollowUp } = props;

    const action = useParamSelector(selectFileActionData, fileActionId);
    const triggerAction = useFileActionTrigger(fileActionId);
    const { icon, active, disabled } = useFileActionProps(fileActionId);
    const { buttonName } = useLocalizedFileActionStrings(action);

    // Combine external click handler with internal one
    const handleClick = useCallback(() => {
      triggerAction();
      if (onClickFollowUp) onClickFollowUp();
    }, [onClickFollowUp, triggerAction]);

    if (!action) return null;
    const { button } = action;
    if (!button) return null;
    if (
      (action.customVisibility !== undefined &&
        action.customVisibility() === CustomVisibilityState.Hidden) ||
      disabled
    )
      return null;

    return (
      <ToolbarDropdownButton
        ref={ref}
        text={buttonName}
        icon={icon}
        onClick={handleClick}
        active={active}
        disabled={disabled}
      />
    );
  },
);
