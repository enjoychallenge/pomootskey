import { createSelector } from '@reduxjs/toolkit'
import { findWords } from '../../app/decode/words'

export const getChars = (state) => state.words.chars
export const getLenInterval = (state) => state.words.lenInterval

export const getWords = createSelector(
  [getChars, getLenInterval],
  (chars, lenInterval) => {
    return chars ? findWords(chars, lenInterval) : []
  }
)
