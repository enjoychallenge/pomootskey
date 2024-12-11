import { createSlice } from '@reduxjs/toolkit'
import { numberSystemsSlice } from '../common/numberSystemsSlice'
import { chars } from '../../app/decode/ternary'

export const ternarySlice = createSlice(
  numberSystemsSlice('ternary', chars)
)

export const {
  onNumberButtonClick,
  inputItemClick,
  oneBackspaceClick,
  longBackspaceClick,
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  variantClick,
  keyDown,
  paste,
} = ternarySlice.actions

export default ternarySlice.reducer
