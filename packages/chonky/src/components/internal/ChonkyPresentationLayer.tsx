/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import ClickAwayListener from '@mui/material/ClickAwayListener';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { reduxActions } from '../../redux/reducers';
import { selectClearSelectionOnOutsideClick, selectFileActionIds, selectIsDnDDisabled } from '../../redux/selectors';
import { ChonkyDispatch } from '../../types/redux.types';
import { useDndContextAvailable } from '../../util/dnd-fallback';
import { elementIsInsideButton } from '../../util/helpers';
import { makeLocalChonkyStyles } from '../../util/styles';
import { useContextMenuTrigger, useContextMenuHandler} from '../external/FileContextMenu-hooks';
import { DnDFileListDragLayer } from '../file-list/DnDFileListDragLayer';
import { HotkeyListener } from './HotkeyListener';
import { Box } from '@mui/material';

export interface ChonkyPresentationLayerProps {
  children?: React.ReactNode;
}

export const ChonkyPresentationLayer: React.FC<ChonkyPresentationLayerProps> = ({ children }) => {
  const dispatch: ChonkyDispatch = useDispatch();
  const fileActionIds = useSelector(selectFileActionIds);
  const dndDisabled = useSelector(selectIsDnDDisabled);
  const clearSelectionOnOutsideClick = useSelector(selectClearSelectionOnOutsideClick);

  // Deal with clicks outside of Chonky
  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!clearSelectionOnOutsideClick || elementIsInsideButton(event.target)) {
        // We only clear out the selection on outside click if the click target
        // was not a button. We don't want to clear out the selection when a
        // button is clicked because Chonky users might want to trigger some
        // selection-related action on that button click.
        return;
      }
      dispatch(reduxActions.clearSelection());
    },
    [dispatch, clearSelectionOnOutsideClick],
  );

  // Generate necessary components
  const hotkeyListenerComponents = useMemo(
    () =>
      fileActionIds.map((actionId) => (
        <HotkeyListener key={`file-action-listener-${actionId}`} fileActionId={actionId} />
      )),
    [fileActionIds],
  );

    const dndContextAvailable = useDndContextAvailable();
    const showContextMenu = useContextMenuTrigger();
    const {
        onTouchStart,
        onTouchMove,
        onTouchCancel,
        onTouchEnd,
        onContextMenu
      } = useContextMenuHandler(showContextMenu);

    const {classes} = useStyles();
    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box className={classes.chonkyRoot} onContextMenu={onContextMenu}
             onTouchStart={onTouchStart}
             onTouchCancel={onTouchCancel}
             onTouchEnd={onTouchEnd}
             onTouchMove={onTouchMove}>
                {!dndDisabled && dndContextAvailable && <DnDFileListDragLayer />}
                {hotkeyListenerComponents}
                {children ? children : null}
            </Box>
        </ClickAwayListener>
    );
};

const useStyles = makeLocalChonkyStyles((theme) => ({
  chonkyRoot: {
    padding: theme.margins.rootLayoutMargin,
    background: theme.palette.background.paper,
    fontSize: theme.fontSizes.rootPrimary,
    color: theme.palette.text.primary,
    touchAction: 'manipulation', // Disabling zoom on double tap
    flexDirection: 'column',
    boxSizing: 'border-box',
    textAlign: 'left',
    borderRadius: 4 * theme.root.borderRadius,
    display: 'flex',
    height: theme.root.height,

    // Disabling select
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
}));
