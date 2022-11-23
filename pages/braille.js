import * as React from 'react'
import { useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Backspace, Circle, CircleOutlined, Send } from '@mui/icons-material'
import styles from '../styles/index.module.css'
import { Button, Grid } from '@mui/material'
import { columns_to_rows, decode, toUTF } from '../app/decode/braille'
import morse_styles from '../styles/morse.module.css'

function BrailleCircle({ selected }) {
  return selected ? (
    <Circle fontSize="large" />
  ) : (
    <CircleOutlined fontSize="large" />
  )
}

function BraillePoint({ allSelected, setSelected, number }) {
  const handleBrailleButtonClick = () => {
    let allSelectedCopy = new Set(allSelected)
    if (allSelectedCopy.has(number)) {
      allSelectedCopy.delete(number)
      setSelected(allSelectedCopy)
    } else {
      allSelectedCopy.add(number)
      setSelected(allSelectedCopy)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Button variant="outlined" onClick={handleBrailleButtonClick}>
        <BrailleCircle selected={allSelected.has(number)} />
        <Typography position="absolute" color={'white'}>
          {number}
        </Typography>
      </Button>
    </Box>
  )
}

export default function BraillePage() {
  const brailleNumbers = [1, 4, 2, 5, 3, 6]
  const [selected, setSelected] = useState(new Set())
  const [entryPoints, setEntryPoints] = useState([])
  const solutionText = entryPoints.map((entry) => decode(entry), '')
  const solutionBraille = entryPoints.map((entry) => toUTF(entry), '')
  const solutionByRowsText = entryPoints.map(
    (entry) => decode(columns_to_rows(entry)),
    ''
  )
  const current = decode(selected)

  const handleSendButtonClick = () => {
    setEntryPoints(entryPoints.concat([selected]))
    setSelected(new Set())
  }

  const handleBackspaceButtonClick = () => {
    setEntryPoints(entryPoints.slice(0, entryPoints.length - 1))
  }

  return (
    <>
      <Box className={styles.page}>
        <AppBar />
        <Box component="main" className={styles.main}>
          <Box className={styles.buttons} sx={{ color: 'primary.main' }}>
            <div>
              <Grid container columns={3}>
                <Grid xs={2} item={true}>
                  <Grid container>
                    {brailleNumbers.map((number) => {
                      return (
                        <Grid xs={6} item={true} key={number}>
                          <BraillePoint
                            allSelected={selected}
                            setSelected={setSelected}
                            number={number}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
                <Grid xs={1} item={true}>
                  <Send onClick={handleSendButtonClick} />
                  <Backspace onClick={handleBackspaceButtonClick} />
                </Grid>
              </Grid>
            </div>
            <div>
              <Typography color={'white'}>{current}</Typography>
            </div>
          </Box>
          <Box sx={{ color: 'result.main' }} className={morse_styles.results}>
            <Typography>Zadání:</Typography>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {solutionBraille}
            </Typography>
          </Box>
          <Box sx={{ color: 'result.main' }} className={morse_styles.results}>
            <Typography>Řešení:</Typography>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {solutionText}
            </Typography>
          </Box>
          <Box sx={{ color: 'result.main' }} className={morse_styles.results}>
            <Typography>Alternativní řešení (tečky po řádkách):</Typography>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {solutionByRowsText}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}
