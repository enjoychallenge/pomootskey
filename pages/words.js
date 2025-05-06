import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Box, TextField, Typography } from '@mui/material'
import { useCallback } from 'react'
import AppBar from '../component/AppBar'
import * as slctr from '../features/words/wordsSelector'
import layout_styles from '../styles/common/layout.module.scss'
import { setChars } from '../features/words/wordsSlice'

export default function WordsPage() {
  const dispatch = useAppDispatch()
  const chars = useAppSelector(slctr.getChars)
  const words = useAppSelector(slctr.getWords)

  const onCharsChange = useCallback(
    (value) => {
      dispatch(setChars({ value }))
    },
    [dispatch]
  )

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
            <Box>
              <TextField
                required
                id="input-chars"
                label="Hledané znaky"
                value={chars}
                onChange={(event) => onCharsChange(event.target.value)}
              />
            </Box>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            {words.map((word, idx) => {
              return <Typography key={idx}>{word}</Typography>
            })}
          </Box>
        </Box>
      </Box>
    </>
  )
}
