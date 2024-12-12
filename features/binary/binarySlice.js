import { createSlice } from '@reduxjs/toolkit'
import { numeralSystemsSlice } from '../common/numeralSystemsSlice'
import { chars } from '../../app/decode/binary'

export const binarySlice = createSlice(numeralSystemsSlice('binary', chars))

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
