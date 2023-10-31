import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import morse_styles from '../styles/morse.module.scss'
import { getJoinerClass } from '../features/morse/util'

export const OutputCharTypes = {
  known: 'known',
  unknown: 'unknown',
}

const TypeToClass = {
  [OutputCharTypes.unknown]: morse_styles.result_item_wrong,
  [OutputCharTypes.known]: morse_styles.result_item,
}

const getInputCharJsx = (inputChar) => {
  if (inputChar === '.') {
    return (
      <svg width="100%" viewBox="0 0 30 50">
        <circle cx="15" cy="35" r="6" />
      </svg>
    )
  } else if (inputChar === '-') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 30 50">
        <path d="M 7 25 h 16" strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  } else if (inputChar === '/') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 30 50">
        <path d="M 7 43 L 23 7" strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  } else {
    return inputChar
  }
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
    const className = TypeToClass[currentOutput.type]
    const inputCharToShow = getInputCharJsx(item.input)

    return (
      <Box key={idx} className={className}>
        <Box className={morse_styles.result_output_char}>
          {item.output?.char || ''}
        </Box>
        <Box
          className={joinerClass}
          sx={{ backgroundColor: 'background.lightPaper' }}
        />
        <Box
          className={morse_styles.result_input_char}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {inputCharToShow}
        </Box>
      </Box>
    )
  })
  return (
    <>
      <Typography sx={{ color: 'result.label' }}>{label}</Typography>
      <Box>
        {partsJsx}
        <Box className={morse_styles.result_item}>
          <Box className={morse_styles.result_output_char} />
          <Box className={morse_styles.result_input_char_joiner_hidden} />
          <Box
            className={`${morse_styles.result_input_char} ${morse_styles.result_input_char_cursor_left}`}
          />
        </Box>
      </Box>
    </>
  )
}
