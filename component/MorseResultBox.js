import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'

export default function MorseResultBox({ label, message }) {
  return (
    <Box sx={{ backgroundColor: 'background.paper' }}>
      <Typography sx={{ color: 'result.label' }}>{label}</Typography>
      <Typography>{message}</Typography>
    </Box>
  )
}
