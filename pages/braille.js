import * as React from 'react'
import { useCallback, useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Circle, CircleOutlined, Send } from '@mui/icons-material'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import { Button, InputBase, Paper } from '@mui/material'
import {
  columnsToRows,
  decode,
  rowsToColumns,
  toUtf,
  invertSelected,
} from '../app/decode/braille'
import braille_styles from '../styles/braille.module.scss'
import { getResultBoxes } from '../app/results'
import BackspaceButton from '../component/BackspaceButton'

const allResults = (message) => {
  const allVariants = [
    {
      label: 'Základní řešení 123456',
      message: message,
    },
    {
      label: 'Alternativní řešení 123456 invertovaně',
      message: message.map(invertSelected),
    },
    {
      label: 'Alternativní řešení číslování po řádcích 135246',
      message: message.map(columnsToRows),
    },
    {
      label: 'Alternativní řešení číslování po řádcích 135246 invertovaně',
      message: message.map((item) => {
        return columnsToRows(invertSelected(item))
      }),
    },
    {
      label: 'Alternativní řešení číslování po řádcích inverzně 142536',
      message: message.map(rowsToColumns),
    },
    {
      label:
        'Alternativní řešení číslování po řádcích inverzně 142536 invertovaně',
      message: message.map((item) => {
        return rowsToColumns(invertSelected(item))
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

const BrailleButton = ({ value, selected, onButtonClick }) => {
  const memoOnButtonClick = useCallback(() => {
    onButtonClick(value)
  }, [onButtonClick, value])

  return (
    <Button
      className={braille_styles.braille_button}
      variant="outlined"
      onClick={memoOnButtonClick}
    >
      {selected.has(value) ? <Circle /> : <CircleOutlined />}
      <Typography color={'result.main'}>{value}</Typography>
    </Button>
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

  const oneBackspaceClick = () => {
    if (selected.size === 0) {
      if (entryPoints.length) {
        setEntryPoints((e) => e.slice(0, e.length - 1))
      }
    } else {
      setSelected(new Set())
    }
  }

  const longBackspaceClick = () => {
    setSelected(new Set())
    setEntryPoints([])
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
              <BrailleButton
                value={1}
                selected={selected}
                onButtonClick={handleBrailleButtonClick}
              />
              <BrailleButton
                value={4}
                selected={selected}
                onButtonClick={handleBrailleButtonClick}
              />

              <Button disabled={true}></Button>
              <BrailleButton
                value={2}
                selected={selected}
                onButtonClick={handleBrailleButtonClick}
              />
              <BrailleButton
                value={5}
                selected={selected}
                onButtonClick={handleBrailleButtonClick}
              />

              <Button
                variant="outlined"
                onClick={handleSendButtonClick}
                className={braille_styles.braille_button}
              >
                <Send />
              </Button>
              <BrailleButton
                value={3}
                selected={selected}
                onButtonClick={handleBrailleButtonClick}
              />
              <BrailleButton
                value={6}
                selected={selected}
                onButtonClick={handleBrailleButtonClick}
              />
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
              <BackspaceButton
                onClick={oneBackspaceClick}
                onLongPress={longBackspaceClick}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  )
}
