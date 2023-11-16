import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import { useCallback } from 'react'
import general_styles from '../styles/common/general.module.scss'

export default function VariantOutputOnlyBox({
  label,
  message,
  idx,
  onVariantClick = null,
}) {
  const memoOnVariantClick = useCallback(() => {
    onVariantClick && onVariantClick(label, idx)
  }, [onVariantClick, label, idx])

  const className = onVariantClick ? general_styles.clickable : null
  return (
    <Box
      sx={{ backgroundColor: 'background.paper' }}
      onClick={memoOnVariantClick}
      className={className}
    >
      <Typography sx={{ color: 'result.label' }}>{label}</Typography>
      <Typography>{message}</Typography>
    </Box>
  )
}
