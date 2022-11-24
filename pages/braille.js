import * as React from 'react'
import { useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Backspace, Circle, CircleOutlined, Send } from '@mui/icons-material'
import styles from '../styles/index.module.css'
import { Button, Grid } from '@mui/material'
import { columns_to_rows, decode, to_utf } from '../app/decode/braille'
import morse_styles from '../styles/morse.module.css'

function BrailleCircle({ selected }) {
  return selected ? (
    <Circle fontSize="large" />
  ) : (
    <CircleOutlined fontSize="large" />
  )
}

function BraillePoint({ all_selected, set_selected, number }) {
  const handle_braille_button_click = () => {
    let all_selected_copy = new Set(all_selected)
    if (all_selected_copy.has(number)) {
      all_selected_copy.delete(number)
      set_selected(all_selected_copy)
    } else {
      all_selected_copy.add(number)
      set_selected(all_selected_copy)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Button variant="outlined" onClick={handle_braille_button_click}>
        <BrailleCircle selected={all_selected.has(number)} />
        <Typography position="absolute" color={'white'}>
          {number}
        </Typography>
      </Button>
    </Box>
  )
}

export default function BraillePage() {
  const braille_numbers = [1, 4, 2, 5, 3, 6]
  const [selected, set_selected] = useState(new Set())
  const [entry_points, set_entry_points] = useState([])
  const solution_text = entry_points.map((entry) => decode(entry), '')
  const solution_braille = entry_points.map((entry) => to_utf(entry), '')
  const solution_by_rows_text = entry_points.map(
    (entry) => decode(columns_to_rows(entry)),
    ''
  )
  const current = decode(selected)

  const handle_send_button_click = () => {
    set_entry_points(entry_points.concat([selected]))
    set_selected(new Set())
  }

  const handle_backspace_button_click = () => {
    set_entry_points(entry_points.slice(0, entry_points.length - 1))
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
                    {braille_numbers.map((number) => {
                      return (
                        <Grid xs={6} item={true} key={number}>
                          <BraillePoint
                            all_selected={selected}
                            set_selected={set_selected}
                            number={number}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
                <Grid xs={1} item={true}>
                  <Send onClick={handle_send_button_click} />
                  <Backspace onClick={handle_backspace_button_click} />
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
              {solution_braille}
            </Typography>
          </Box>
          <Box sx={{ color: 'result.main' }} className={morse_styles.results}>
            <Typography>Řešení:</Typography>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {solution_text}
            </Typography>
          </Box>
          <Box sx={{ color: 'result.main' }} className={morse_styles.results}>
            <Typography>Alternativní řešení (tečky po řádkách):</Typography>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {solution_by_rows_text}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}
