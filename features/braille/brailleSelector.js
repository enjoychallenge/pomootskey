import { createSelector } from '@reduxjs/toolkit'
import {
  decode,
  columnsToRows,
  invertSelected,
  rowsToColumns,
  toUtf,
} from '../../app/decode/braille'

export const getSelected = (state) => state.braille.selected
export const getEntryPoints = (state) => state.braille.entryPoints

export const getInput = createSelector(
  [getSelected, getEntryPoints],
  (selected, entryPoints) => {
    return !selected.length ? entryPoints : entryPoints.concat([selected])
  }
)

export const getAllResults = createSelector([getInput], (input) => {
  const allVariants = [
    {
      label: 'Základní řešení 123456',
      message: input.map((item) => {
        return new Set(item)
      }),
    },
    {
      label: 'Alternativní řešení 123456 invertovaně',
      message: input.map(invertSelected),
    },
    {
      label: 'Alternativní řešení číslování po řádcích 135246',
      message: input.map(columnsToRows),
    },
    {
      label: 'Alternativní řešení číslování po řádcích 135246 invertovaně',
      message: input.map((item) => {
        return columnsToRows(invertSelected(item))
      }),
    },
    {
      label: 'Alternativní řešení číslování po řádcích inverzně 142536',
      message: input.map(rowsToColumns),
    },
    {
      label:
        'Alternativní řešení číslování po řádcích inverzně 142536 invertovaně',
      message: input.map((item) => {
        return rowsToColumns(invertSelected(item))
      }),
    },
  ]
  const decodedVariants = allVariants.map((variant) => {
    return {
      ...variant,
      decoded: variant.message.map((selected) => decode(selected)),
    }
  })
  return decodedVariants
})

export const getInputSolution = createSelector([getInput], (input) => {
  return input.map((entry) => toUtf(entry), '').join('')
})
