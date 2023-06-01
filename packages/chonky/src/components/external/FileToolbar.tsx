import React, { ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectToolbarItems, selectHideToolbarInfo } from '../../redux/selectors';
import { makeLocalChonkyStyles } from '../../util/styles';
import { getValueOrFallback } from '../../util/helpers';
import { SmartToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ToolbarInfo } from './ToolbarInfo';
import { ToolbarSearch } from './ToolbarSearch';

export interface FileToolbarProps {
  hideSearchBar?: boolean;
}

export const FileToolbar: React.FC<FileToolbarProps> = React.memo((props) => {
  const { classes } = useStyles();
  const toolbarItems = useSelector(selectToolbarItems);

  const toolbarItemComponents = useMemo(() => {
    const components: ReactElement[] = [];
    for (let i = 0; i < toolbarItems.length; ++i) {
      const item = toolbarItems[i];

      const key = `toolbar-item-${typeof item === 'string' ? item : item.name}`;
      const component =
        typeof item === 'string' ? (
          <SmartToolbarButton key={key} fileActionId={item} />
        ) : (
          <ToolbarDropdown key={key} {...item} />
        );
      components.push(component);
    }
    return components;
  }, [toolbarItems]);

  const hideToolbarInfo = useSelector(selectHideToolbarInfo);
  const hideSearchBar = getValueOrFallback(props.hideSearchBar, true)

  return (
    <div className={classes.toolbarWrapper}>
      <div className={classes.toolbarContainer}>
        <div className={classes.toolbarLeft}>
          {!hideSearchBar && <ToolbarSearch />}
          {!hideToolbarInfo && <ToolbarInfo />}
        </div>
        <div className={classes.toolbarRight}>{toolbarItemComponents}</div>
      </div>
    </div>
  );
});

const useStyles = makeLocalChonkyStyles((theme) => ({
  toolbarWrapper: {},
  toolbarContainer: {
    flexWrap: 'wrap-reverse',
    display: 'flex',
  },
  toolbarLeft: {
    paddingBottom: theme.margins.rootLayoutMargin,
    flexWrap: 'wrap',
    flexGrow: 10000,
    display: 'flex',
  },
  toolbarLeftFiller: {
    flexGrow: 10000,
  },
  toolbarRight: {
    paddingBottom: theme.margins.rootLayoutMargin,
    flexWrap: 'wrap',
    display: 'flex',
  },
}));
