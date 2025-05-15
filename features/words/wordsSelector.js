import { createSelector } from '@reduxjs/toolkit'
import { findWords, searchTypeEnum } from '../../app/decode/words'

export const getChars = (state) => state.words.chars
export const getSearchType = (state) => state.words.searchType
const getLenIntervalValue = (state) => state.words.lenInterval
export const getCaseInsensitive = (state) => state.words.caseInsensitive
export const getDiacriticsInsensitive = (state) =>
  state.words.diacriticsInsensitive

const getNormalize = createSelector(
  [getCaseInsensitive, getDiacriticsInsensitive],
  (caseInsensitive, diacriticsInsensitive) => {
    return (x) => {
      const casedX = caseInsensitive ? x.toLowerCase() : x
      const diacriticsX = diacriticsInsensitive
        ? casedX.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        : casedX
      return diacriticsX
    }
  }
)

export const getLenInterval = createSelector(
  [getLenIntervalValue, getSearchType, getChars],
  (lenIntervalValue, searchType, chars) => {
    return searchType !== searchTypeEnum.Anagram
      ? lenIntervalValue
      : [chars.length, chars.length]
  }
)

const getSearchMethod = createSelector(
  [getSearchType],
  (searchType) => {
    switch (searchType) {
      case searchTypeEnum.Subtring:
        return (word, normalizedChars) =>
          word.includes(normalizedChars)
      case searchTypeEnum.Anagram:
        return (word, normalizedChars) =>
          word.split('').sort().join('') ===
          normalizedChars.split('').sort().join('')
    }
  }
)

export const getWords = createSelector(
  [getChars, getLenInterval, getNormalize, getSearchMethod],
  (chars, lenInterval, normalize, searchMethod) => {
    return chars ? findWords(chars, lenInterval, normalize, searchMethod) : []
  }
)

export const getLenIntervalEnabled = createSelector(
  [getSearchType],
  (searchType) => {
    return searchType !== searchTypeEnum.Anagram
  }
)
