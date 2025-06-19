import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import { AlphabetEn } from '../app/decode/common'
import { codeChar as morseCode } from '../app/decode/morse'
import { codeChar as brailleCode } from '../app/decode/braille'
import { codeChar as semaphoreCode } from '../app/decode/semaphore'
import { getInputCharJsx as morseCharJsx } from './morse'
import { getInputCharJsx as brailleCharJsx } from './braille'
import { getInputCharJsx as semaphoreCharJsx } from './semaphore'

import AppBar from '../component/AppBar'
import layout_styles from '../styles/common/layout.module.scss'
import reference_styles from '../styles/reference.module.scss'
import morse_styles from '../styles/morse.module.scss'
import braille_styles from '../styles/braille.module.scss'
import semaphore_styles from '../styles/semaphore.module.scss'
import * as React from 'react'

export default function WordsPage() {
  const chars = AlphabetEn.split('')
  const tableRowsJsw = chars.map((char, index) => {
    return (
      <TableRow key={char} className={reference_styles.row}>
        <TableCell className={reference_styles.number_cell}>
          {index + 1}
        </TableCell>
        <TableCell>{char.toUpperCase()}</TableCell>
        <TableCell>
          <Box className={reference_styles.morse_cell}>
            {morseCode(char)
              .split('')
              .map((c) => (
                <Box key={char} className={morse_styles.result_input_char}>
                  {morseCharJsx(c)}
                </Box>
              ))}
          </Box>
        </TableCell>
        <TableCell>
          <Box
            className={[
              braille_styles.result_input_char,
              reference_styles.svg_cell,
            ].join(' ')}
          >
            {brailleCharJsx(brailleCode(char))}
          </Box>
        </TableCell>
        <TableCell>
          <Box
            className={[
              semaphore_styles.result_input_char,
              reference_styles.svg_cell,
            ].join(' ')}
          >
            {semaphoreCharJsx(semaphoreCode(char))}
          </Box>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <>
      <Box className={layout_styles.page}>
        <AppBar />
        <Box
          component="main"
          className={reference_styles.main}
          sx={{ color: 'primary.main' }}
        >
          <TableContainer className={reference_styles.table}>
            <Table>
              <TableBody>{tableRowsJsw}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  )
}
