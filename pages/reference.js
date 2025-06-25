import {
  Box,
  IconButton,
  FormGroup,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Add, Remove } from '@mui/icons-material'
import { AlphabetEn } from '../app/decode/common'
import { codeChar as morseCode } from '../app/decode/morse'
import { codeChar as brailleCode } from '../app/decode/braille'
import { codeChar as semaphoreCode } from '../app/decode/semaphore'
import { getInputCharJsx as morseCharJsx } from './morse'
import { getInputCharJsx as brailleCharJsx } from './braille'
import { getInputCharJsx as semaphoreCharJsx } from './semaphore'

import AppBar from '../component/AppBar'
import layout_styles from '../styles/common/layout.module.scss'
import reference_styles from '../styles/reference.module.scss'
import morse_styles from '../styles/morse.module.scss'
import braille_styles from '../styles/braille.module.scss'
import semaphore_styles from '../styles/semaphore.module.scss'
import * as React from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/reference/referenceSelector'
import {
  addClick,
  removeClick,
  favoritesInputChange,
  showFavoritesSwitch,
} from '../features/reference/referenceSlice'
import { useCallback } from 'react'
import { useHideStyles } from '../hooks/useHideStyles'

const AddOrRemove = ({
  index,
  char,
  showFavorites,
  onAddClick,
  onRemoveClick,
}) => {
  const onClick = useCallback(() => {
    showFavorites ? onRemoveClick(index) : onAddClick(char)
  }, [showFavorites, onRemoveClick, index, onAddClick, char])

  return (
    <IconButton onClick={onClick} alt={char}>
      {showFavorites ? <Remove /> : <Add />}
    </IconButton>
  )
}

export default function ReferencePage() {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector(slctr.getFavorites)
  const showFavorites = useAppSelector(slctr.getShowFavorites)
  const hideStyles = useHideStyles()

  const onAddClick = useCallback(
    (char) => dispatch(addClick({ char })),
    [dispatch]
  )

  const onRemoveClick = useCallback(
    (index) => dispatch(removeClick({ index })),
    [dispatch]
  )

  const onSwitchChange = useCallback(() => {
    dispatch(showFavoritesSwitch())
  }, [dispatch])

  const onInputChange = useCallback(
    (event) => {
      dispatch(favoritesInputChange(event.target.value))
    },
    [dispatch]
  )

  const chars =
    showFavorites && favorites.length > 0
      ? favorites
          .map((c) => c.toLowerCase())
          .filter((c) => AlphabetEn.includes(c))
          .slice()
      : AlphabetEn.split('')

  const getCharRowJsx = (char, key) => {
    const index = AlphabetEn.indexOf(char)
    const starJsx = (
      <TableCell className={reference_styles.star_cell}>
        <AddOrRemove
          index={key}
          char={char}
          showFavorites={showFavorites}
          onAddClick={onAddClick}
          onRemoveClick={onRemoveClick}
        />
      </TableCell>
    )
    return (
      <TableRow key={key} className={reference_styles.row}>
        {starJsx}
        <TableCell className={reference_styles.number_cell}>
          <Typography
            component={'span'}
            display="inline"
            noWrap={true}
            variant="h5"
            align="right"
          >
            {index + 1}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            component={'span'}
            display="inline"
            noWrap={true}
            variant="h5"
            align="right"
          >
            {char.toUpperCase()}
          </Typography>
        </TableCell>
        <TableCell>
          <Box className={reference_styles.morse_cell}>
            {morseCode(char)
              .split('')
              .map((c, idx) => (
                <Box
                  key={char + idx}
                  className={morse_styles.result_input_char}
                >
                  {morseCharJsx(c)}
                </Box>
              ))}
          </Box>
        </TableCell>
        <TableCell>
          <Box className={[braille_styles.result_input_char].join(' ')}>
            {brailleCharJsx(brailleCode(char))}
          </Box>
        </TableCell>
        <TableCell>
          <Box className={[semaphore_styles.result_input_char].join(' ')}>
            {semaphoreCharJsx(semaphoreCode(char))}
          </Box>
        </TableCell>
      </TableRow>
    )
  }

  const tableRowsJsw = chars.map((char, index) => {
    return getCharRowJsx(char, index)
  })

  return (
    <>
      <Box className={layout_styles.page}>
        <AppBar customStyles={hideStyles} />
        <Box
          component="main"
          className={reference_styles.main}
          sx={{ color: 'primary.main' }}
        >
          <Box className={layout_styles.inputs_box}>
            <TextField
              id="favorite-chars"
              label="Favorites"
              value={favorites.join('')}
              onChange={onInputChange}
              inputProps={{
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: 'false',
              }}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showFavorites}
                    disabled={favorites.length === 0}
                    onChange={onSwitchChange}
                  />
                }
                label="Favorites"
              />
            </FormGroup>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <TableContainer className={reference_styles.table}>
              <Table>
                <TableBody className={reference_styles.table_body}>
                  {tableRowsJsw}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </>
  )
}
