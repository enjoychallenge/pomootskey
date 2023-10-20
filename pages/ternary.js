import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import layout_styles from '../styles/common/layout.module.scss'
import Button from '@mui/material/Button'
import BackspaceButton from '../component/BackspaceButton'
import ternary_styles from '../styles/ternary.module.scss'
import { Send } from '@mui/icons-material'
import ResultBox from '../component/ResultBox'
import { useState } from 'react'

const defaultValues = () => {
  const defaultValuesArray = new Uint8Array(3)
  defaultValuesArray[0] = 2
  defaultValuesArray[1] = 0
  defaultValuesArray[2] = 1
  return defaultValuesArray
}

export default function TernaryPage() {
  const [actualValues, setActualValues] = useState(defaultValues())
  const [allValues, setAllValues] = useState([])

  const handleSendButtonClick = () => {
    setAllValues(allValues.concat(actualValues))
    setActualValues(defaultValues())
  }

  const TernaryButton = ({ position }) => {
    const handleClick = (position) => {
      const values = actualValues
      values[position] = (values[position] + 1) % 3
      setActualValues(values)
    }

    const value = actualValues[position]
    const variant = {
      0: 'text',
      1: 'outlined',
      2: 'contained',
    }[value]

    return (
      <Button
        variant={variant}
        onClick={() => handleClick(position)}
      >
        <Typography>{value}</Typography>
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
          <Box className={ternary_styles.inputs_box}>
            <Box className={ternary_styles.buttons_box}>
              <BackspaceButton className={ternary_styles.backspace_button} />
              <Button
                variant="text"
                className={ternary_styles.ternary_button}
                onClick={() => handleSendButtonClick()}
              >
                <Send />
              </Button>
            </Box>
            <Box className={ternary_styles.buttons_box}>
              <TernaryButton position={0} />
              <TernaryButton position={1} />
              <TernaryButton position={2} />
            </Box>
          </Box>

          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <Box className={ternary_styles.result_column}>
              <Box>
                <Typography component={'span'} key={0} display="inline">
                  a
                </Typography>
              </Box>
              <Box className={ternary_styles.small_values}>
                <Button
                  variant={'contained'}
                >
                  <Typography>{2}</Typography>
                </Button>
                <Button
                  variant={'text'}
                >
                  <Typography>{0}</Typography>
                </Button>
                <Button
                  variant={'outlined'}
                >
                  <Typography>{1}</Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
