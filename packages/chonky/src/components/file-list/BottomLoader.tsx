import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function BottomLoader() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '6px' }}>
            <CircularProgress size={30} />
        </Box>
    )
}