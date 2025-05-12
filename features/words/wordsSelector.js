import { createSelector } from '@reduxjs/toolkit'
import { findWords } from '../../app/decode/words'

export const getChars = (state) => state.words.chars
export const getLenInterval = (state) => state.words.lenInterval
export const getCaseInsensitive = (state) => state.words.caseInsensitive

export const getNormalize = createSelector(
  [getCaseInsensitive],
  (caseInsensitive) => {
    return (x) => (caseInsensitive ? x.toLowerCase() : x)
  }
)
export const getWords = createSelector(
  [getChars, getLenInterval, getNormalize],
  (chars, lenInterval, normalize) => {
    return chars ? findWords(chars, lenInterval, normalize) : []
  }
)
