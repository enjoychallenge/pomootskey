import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import morse_styles from '../styles/morse.module.scss'

export const OutputCharTypes = {
  known: 'known',
  unknown: 'unknown',
}

const getJoinerClass = (showJoiner, isStartItem, isEndItem) => {
  if (!showJoiner) {
    return morse_styles.result_input_char_joiner_hidden
  }
  if (isStartItem && isEndItem) {
    return morse_styles.result_input_char_joiner
  } else if (isStartItem && !isEndItem) {
    return morse_styles.result_input_char_joiner_start
  } else if (!isStartItem && isEndItem) {
    return morse_styles.result_input_char_joiner_end
  } else {
    return morse_styles.result_input_char_joiner_middle
  }
}

const TypeToColor = {
  [OutputCharTypes.unknown]: 'warning.main',
  [OutputCharTypes.known]: 'result.main',
}

export default function MorseResultBox({ label, inputItems }) {
  let currentOutput = null
  const partsJsx = inputItems.map((item, idx) => {
    currentOutput = item.output || currentOutput
    const isStartItem = !!item.output
    const nextItem = inputItems[idx + 1]
    const isEndItem = !nextItem || !!nextItem.output
    const joinerClass = getJoinerClass(
      currentOutput.showJoiner,
      isStartItem,
      isEndItem
    )
    const color = TypeToColor[currentOutput.type]
    return (
      <Box key={idx} className={morse_styles.result_item} sx={{ color }}>
        <Box className={morse_styles.result_output_char}>
          {item.output?.char || ''}
        </Box>
        <Box
          className={joinerClass}
          sx={{ backgroundColor: 'background.lightPaper' }}
        >
          {' '}
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
