/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { Nullable } from 'tsdef';

import { makeLocalChonkyStyles } from '../../util/styles';
import {cx} from '@emotion/css'
import { Box, SxProps } from '@mui/material';

export interface FileThumbnailProps {
  className: string;
  thumbnailUrl: Nullable<string>;
}

export const FileThumbnail: React.FC<FileThumbnailProps> = React.memo((props) => {
  const { className, thumbnailUrl } = props;

  const thumbnailStyle: SxProps = thumbnailUrl ? { backgroundImage: `url('${thumbnailUrl}')` } : {};

  const {classes} = useStyles();
  return <Box className={cx([className, classes.fileThumbnail])} sx={thumbnailStyle} />;
});
FileThumbnail.displayName = 'FileThumbnail';

const useStyles = makeLocalChonkyStyles(() => ({
  fileThumbnail: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  },
}));
