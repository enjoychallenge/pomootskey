import { createSlice } from '@reduxjs/toolkit'
import { searchTypeEnum } from '../../app/decode/words'

const initialState = {
  chars: '',
  searchType: searchTypeEnum.Subtring,
  lenInterval: [1, 38],
  caseInsensitive: true,
  diacriticsInsensitive: true,
}

export const wordsSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {
    setChars: (state, action) => {
      state.chars = action.payload.value
    },
    setLenInterval: (state, action) => {
      state.lenInterval = action.payload.value
    },
    setCaseInsensitive: (state, action) => {
      state.caseInsensitive = action.payload.value
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload.value
    },
    setDiacriticsInsensitive: (state, action) => {
      state.diacriticsInsensitive = action.payload.value
    },
  },
})

export const {
  setChars,
  setSearchType,
  setLenInterval,
  setCaseInsensitive,
  setDiacriticsInsensitive,
} = wordsSlice.actions

export default wordsSlice.reducer
