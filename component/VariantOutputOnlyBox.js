import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import { useCallback } from 'react'

export default function VariantOutputOnlyBox({
  label,
  message,
  idx,
  onVariantClick = null,
}) {
  const memoOnVariantClick = useCallback(() => {
    onVariantClick && onVariantClick(label, idx)
  }, [onVariantClick, label, idx])

  return (
    <Box
      sx={{ backgroundColor: 'background.paper' }}
      onClick={memoOnVariantClick}
    >
      <Typography sx={{ color: 'result.label' }}>{label}</Typography>
      <Typography>{message}</Typography>
    </Box>
  )
}
