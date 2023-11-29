import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import { ChonkyActions } from '../../action-definitions/index';
import { reduxActions } from '../../redux/reducers';
import { selectContextMenuMounted } from '../../redux/selectors';
import { thunkRequestFileAction } from '../../redux/thunks/dispatchers.thunks';
import { ChonkyDispatch } from '../../types/redux.types';
import { findElementAmongAncestors } from '../../util/helpers';
import { useInstanceVariable } from '../../util/hooks-helpers';

export const findClosestChonkyFileId = (
    element: HTMLElement | any
): Nullable<string> => {
    const fileEntryWrapperDiv = findElementAmongAncestors(
        element,
        (element: any) =>
            element.tagName &&
            element.tagName.toLowerCase() === 'div' &&
            element.dataset &&
            element.dataset.chonkyFileId
    );
    return fileEntryWrapperDiv ? fileEntryWrapperDiv.dataset.chonkyFileId! : null;
};

export const useContextMenuTrigger = () => {
    const dispatch: ChonkyDispatch = useDispatch();
    const contextMenuMountedRef = useInstanceVariable(
        useSelector(selectContextMenuMounted)
    );
    return useCallback(
        (event: React.MouseEvent<HTMLDivElement> | Touch) => {
            // Use default browser context menu when Chonky context menu component
            // is not mounted.
            if (!contextMenuMountedRef.current) return;
            // Users can use Alt+Right Click to bring up browser's default
            // context menu instead of Chonky's context menu.

            if (typeof Touch == 'function' && !(event instanceof Touch)) {
                if (event.altKey) return;
                event.preventDefault();
            } else if (typeof Touch === 'undefined') {
                if ((event as React.MouseEvent<HTMLDivElement>).altKey) return;
                (event as React.MouseEvent<HTMLDivElement>).preventDefault();
            }

            const triggerFileId = findClosestChonkyFileId(event.target);
            dispatch(
                thunkRequestFileAction(ChonkyActions.OpenFileContextMenu, {
                    clientX: event.clientX,
                    clientY: event.clientY,
                    triggerFileId,
                })
            );
        },
        [contextMenuMountedRef, dispatch]
    );
};

const longPressDuration = 610;

export function useContextMenuHandler(
    callback: (e: React.MouseEvent<HTMLDivElement> | Touch) => void
) {
    let longPressCountdown: ReturnType<typeof setTimeout>;
    let contextMenuPossible: boolean = false;

    const onTouchStart = (e) => {
        contextMenuPossible = true;
        const touch = e.touches[0];
        longPressCountdown = setTimeout(() => {
            contextMenuPossible = false;
            callback(touch);
        }, longPressDuration);
    };

    const onTouchMove = () => {
        clearTimeout(longPressCountdown);
    };

    const onTouchCancel = () => {
        contextMenuPossible = false;
        clearTimeout(longPressCountdown);
    };

    const onTouchEnd = () => {
        contextMenuPossible = false;
        clearTimeout(longPressCountdown);
    };

    const onContextMenu = (e) => {
        contextMenuPossible = false;
        clearTimeout(longPressCountdown);
        callback(e);
        e.preventDefault();
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchCancel,
        onTouchEnd,
        onContextMenu,
    };
}

export const useContextMenuDismisser = () => {
    const dispatch: ChonkyDispatch = useDispatch();
    return useCallback(() => dispatch(reduxActions.hideContextMenu()), [dispatch]);
};
