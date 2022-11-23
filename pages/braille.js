import * as React from 'react'
import { useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Circle, CircleOutlined, Send } from '@mui/icons-material'
import styles from '../styles/index.module.css'
import { Button, Grid } from '@mui/material'
import { decode } from '../app/decode/braille'

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

function BrailleTable({ selected, setSelected }) {
  const brailleNumbers = [1, 4, 2, 5, 3, 6]
  return (
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
  )
}

function BrailleInput({ selected, setSelected }) {
  return (
    <Grid container columns={3}>
      <Grid xs={2} item={true}>
        <BrailleTable selected={selected} setSelected={setSelected} />
      </Grid>
      <Grid xs={1} item={true}>
        <Send />
      </Grid>
    </Grid>
  )
}

function BrailleOutput({ selected }) {
  const selectedString = decode(selected)
  return <Typography color={'white'}>{selectedString}</Typography>
}

export default function BraillePage() {
  const [selected, setSelected] = useState(new Set())
  return (
    <>
      <Box className={styles.page}>
        <AppBar />
        <Box component="main" className={styles.main}>
          <Box className={styles.buttons} sx={{ color: 'primary.main' }}>
            <div>
              <BrailleInput selected={selected} setSelected={setSelected} />
            </div>
            <div>
              <BrailleOutput selected={selected} />
            </div>
          </Box>
        </Box>
      </Box>
    </>
  )
}
