import { createSlice } from '@reduxjs/toolkit'
import { numeralSystemsSlice } from '../common/numeralSystemsSlice'
import { chars } from '../../app/decode/ternary'

export const ternarySlice = createSlice(numeralSystemsSlice('ternary', chars))

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
