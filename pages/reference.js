import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'

import AppBar from '../component/AppBar'
import layout_styles from '../styles/common/layout.module.scss'
import reference_styles from '../styles/reference.module.scss'
import * as React from 'react'

export default function WordsPage() {
  const chars = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const tableRowsJsw = chars.map((char, index) => {
    return (
      <TableRow key={char} className={reference_styles.row}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{char.toUpperCase()}</TableCell>
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
          <Box className={reference_styles.table}>
            <TableContainer component={Paper}>
              <TableBody>{tableRowsJsw}</TableBody>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </>
  )
}
