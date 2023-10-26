import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import morse_styles from '../styles/morse.module.scss'

export default function MorseResultBox({ label, inputItems }) {
  const partsJsx = inputItems.map((item, idx) => {
    return (
      <Box key={idx} className={morse_styles.result_item}>
        <Box className={morse_styles.result_output_char}>
          {item.output?.char || ''}
        </Box>
        <Box
          className={morse_styles.result_input_char}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {item.input}
        </Box>
      </Box>
    )
  })
  return (
    <>
      <Typography sx={{ color: 'result.label' }}>{label}</Typography>
      <Box>{partsJsx}</Box>
    </>
  )
}
