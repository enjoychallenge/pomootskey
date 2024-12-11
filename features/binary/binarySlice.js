import { createSlice } from '@reduxjs/toolkit'
import { numberSystemsSlice } from '../common/numberSystemsSlice'
import { chars } from '../../app/decode/binary'

export const binarySlice = createSlice(numberSystemsSlice('binary', chars))

export const {
  onNumberButtonClick: onNumberButtonClick,
  inputItemClick,
  oneBackspaceClick,
  longBackspaceClick,
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  variantClick,
  keyDown,
  paste,
} = binarySlice.actions

export default binarySlice.reducer
