import * as React from 'react'
import { InputBase } from '@mui/material'
import input_styles from '../styles/common/input.module.scss'

export default function Placeholder() {
  return (
    <InputBase
      multiline
      fullWidth
      value=""
      readOnly={true}
      variant="filled"
      size="small"
      className={input_styles.text_input}
      placeholder={'Zde se po zadání vstupu objeví řešení'}
    />
  )
}
