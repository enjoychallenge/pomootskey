import * as React from 'react'
import { useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Backspace, Circle, CircleOutlined, Send } from '@mui/icons-material'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import { Button, InputBase, Paper } from '@mui/material'
import { decode, toUtf } from '../app/decode/braille'
import braille_styles from '../styles/braille.module.scss'
import Placeholder from '../component/Placeholder'
import ResultBox from '../component/ResultBox'

const messageToReact = (allSelected) => {
  return allSelected.length ? (
    [...allSelected].map((selected, charIdx) => {
      const character = decode(selected)
      const color =
        character === String.fromCharCode(10734) ? 'warning.main' : ''
      return (
        <Typography key={charIdx} sx={{ color }} display="inline">
          {character}
        </Typography>
      )
    })
  ) : (
    <Placeholder />
  )
}

export default function BraillePage() {
  const [selected, setSelected] = useState(new Set())
  const [entryPoints, setEntryPoints] = useState([])
  const input =
    selected.size == 0 ? entryPoints : entryPoints.concat([selected])
  const solutionBraille = input.map((entry) => toUtf(entry), '')

  const handleSendButtonClick = () => {
    setEntryPoints(entryPoints.concat([selected]))
    setSelected(new Set())
  }

  const handleBackspaceButtonClick = () => {
    if (selected.size === 0) {
      if (entryPoints.length) {
        setEntryPoints(entryPoints.slice(0, entryPoints.length - 1))
      }
    } else {
      setSelected(new Set())
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
      <Box className={layout_styles.page}>
        <AppBar />
        <Box
          component="main"
          className={layout_styles.main_decoder}
          sx={{ color: 'primary.main' }}
        >
          <Box className={layout_styles.inputs_box}>
            <Box className={braille_styles.buttons}>
              <Button disabled={true}></Button>
              <BrailleButton value={1} />
              <BrailleButton value={4} />

              <Button disabled={true}></Button>
              <BrailleButton value={2} />
              <BrailleButton value={5} />

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
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <Box className={layout_styles.result_cases}>
              <ResultBox
                label={'Základní řešení'}
                message={messageToReact(input)}
              />
            </Box>
            <Paper className={input_styles.input_paper}>
              <InputBase
                multiline
                fullWidth
                value={solutionBraille.join('')}
                readOnly={true}
                variant="filled"
                size="small"
                className={input_styles.text_input}
              />
              <Button onClick={handleBackspaceButtonClick}>
                <Backspace />
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  )
}
