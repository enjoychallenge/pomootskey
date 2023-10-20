import { createSelector } from '@reduxjs/toolkit'
import { decode } from '../../app/decode/semaphore'
import { getVariants } from './util'

export const getSelected = (state) => state.semaphore.selected
export const getIsFocusing = (state) => state.semaphore.isFocusing
export const getFocused = (state) => state.semaphore.focused
export const getMessage = (state) => state.semaphore.message

export const getMessageWithSets = createSelector([getMessage], (message) => {
  return message.map((points) => new Set(points))
})

export const getMessageString = createSelector(
  [getMessageWithSets],
  (message) => {
    return message.length
      ? message.map((chosenPoints) => decode(chosenPoints).char).join('')
      : ''
  }
)

const getInvertedMessageWithSets = createSelector(
  [getMessageWithSets],
  (message) => {
    return message.map((item) => {
      return new Set(
        [...item].map((button) => {
          return {
            1: 1,
            2: 8,
            3: 7,
            4: 6,
            5: 5,
            6: 4,
            7: 3,
            8: 2,
          }[button]
        })
      )
    })
  }
)

export const getAllResults = createSelector(
  [getMessageWithSets, getInvertedMessageWithSets],
  (message, invertedMessage) => {
    const allVariants = [
      {
        label: 'Základní řešení',
        message: message,
      },
    ]
      .concat(getVariants(message))
      .concat(getVariants(invertedMessage, 'zrcadlově, ', false))
    return allVariants.map((variant) => {
      return {
        ...variant,
        decoded: variant.message.map(decode),
      }
    })
  }
)
