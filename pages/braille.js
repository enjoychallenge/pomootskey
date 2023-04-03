import * as React from 'react'
import { useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Backspace, Circle, CircleOutlined, Send } from '@mui/icons-material'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import { Button, InputBase, Paper } from '@mui/material'
import {
  columnsToRows,
  decode,
  rowsToColumns,
  toUtf,
} from '../app/decode/braille'
import braille_styles from '../styles/braille.module.scss'
import { getResultBoxes } from '../app/results'

const allResults = (message) => {
  const allVariants = [
    {
      label: 'Základní řešení 123456',
      message: message,
    },
    {
      label: 'Alternativní řešení číslování po řádcích 135246',
      message: message.map((item) => {
        return columnsToRows(item)
      }),
    },
    {
      label: 'Alternativní řešení číslování po řádcích inverzně 142536',
      message: message.map((item) => {
        return rowsToColumns(item)
      }),
    },
  ]
  const decodedVariants = allVariants.map((variant) => {
    return {
      ...variant,
      decoded: variant.message.map((selected) => decode(selected)),
    }
  })
  return getResultBoxes(decodedVariants)
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
              {allResults(input)}
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
