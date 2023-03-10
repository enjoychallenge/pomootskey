import * as React from 'react'
import { useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Backspace, Circle, CircleOutlined, Send } from '@mui/icons-material'
import styles from '../styles/index.module.css'
import { Button, InputBase, Paper } from '@mui/material'
import { columnsToRows, decode, toUtf } from '../app/decode/braille'
import morse_styles from '../styles/morse.module.css'
import braille_styles from '../styles/braille.module.css'

export default function BraillePage() {
  const [selected, setSelected] = useState(new Set())
  const [entryPoints, setEntryPoints] = useState([])
  const solutionText = entryPoints.map((entry) => decode(entry), '')
  const solutionBraille = entryPoints.map((entry) => toUtf(entry), '')
  const solutionByRowsText = entryPoints.map(
    (entry) => decode(columnsToRows(entry)),
    ''
  )
  const current = selected.size == 0 ? '' : decode(selected)

  const handleSendButtonClick = () => {
    setEntryPoints(entryPoints.concat([selected]))
    setSelected(new Set())
  }

  const handleBackspaceButtonClick = () => {
    if (entryPoints.length) {
      setEntryPoints(entryPoints.slice(0, entryPoints.length - 1))
    }
  }

  const handleBrailleButtonClick = (value) => {
    let allSelectedCopy = new Set(selected)
    if (allSelectedCopy.has(value)) {
      allSelectedCopy.delete(value)
      setSelected(allSelectedCopy)
    } else {
      allSelectedCopy.add(value)
      setSelected(allSelectedCopy)
    }
  }

  const BrailleButton = ({ value }) => {
    return (
      <Button
        className={braille_styles.braille_button}
        variant="outlined"
        onClick={() => handleBrailleButtonClick(value)}
      >
        {selected.has(value) ? <Circle /> : <CircleOutlined />}
        <Typography color={'result.main'}>{value}</Typography>
      </Button>
    )
  }

  return (
    <>
      <Box className={styles.page}>
        <AppBar />
        <Box
          component="main"
          className={[styles.main, morse_styles.main]}
          sx={{ color: 'primary.main' }}
        >
          <Box className={morse_styles.inputs}>
            <Box className={braille_styles.buttons}>
              <Box>
                <div>
                  <Typography color={'white'} className={styles.current_char}>
                    {current}
                  </Typography>
                </div>
                <BrailleButton value={1} />
                <BrailleButton value={4} />
              </Box>
              <Box>
                <Button></Button>
                <BrailleButton value={2} />
                <BrailleButton value={5} />
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  onClick={handleSendButtonClick}
                  className={braille_styles.braille_button}
                >
                  <Send />
                </Button>
                <BrailleButton value={3} />
                <BrailleButton value={6} />
              </Box>
            </Box>
            <Paper className={styles.input_paper}>
              <InputBase
                hiddenLabel
                multiline
                fullWidth
                value={solutionBraille}
                readOnly="true"
                variant="filled"
                size="small"
                className={morse_styles.text_input}
              />
              <Button onClick={handleBackspaceButtonClick}>
                <Backspace />
              </Button>
            </Paper>
          </Box>
          <Box sx={{ color: 'result.main' }} className={morse_styles.results}>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {solutionText}
            </Typography>
            <Typography>Alternativní řešení:</Typography>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {solutionByRowsText}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}
