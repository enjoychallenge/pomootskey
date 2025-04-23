import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import { useCallback } from 'react'
import general_styles from '../styles/common/general.module.scss'

export default function VariantOutputOnlyBox({
  variantKey,
  label,
  message,
  idx,
  onVariantClick = null,
  selected = false,
}) {
  const memoOnVariantClick = useCallback(() => {
    onVariantClick && onVariantClick(variantKey, idx)
  }, [onVariantClick, variantKey, idx])

  const className = onVariantClick ? general_styles.clickable : null
  const bgColor = selected ? 'primary.main' : 'background.paper'
  return (
    <Box
      sx={{ backgroundColor: bgColor }}
      onClick={memoOnVariantClick}
      className={className}
      data-testid={variantKey}
    >
      <Typography sx={{ color: 'result.label' }}>{label}</Typography>
      <Typography>{message}</Typography>
    </Box>
  )
}
