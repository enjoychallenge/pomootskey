import { charToValueIndex } from '../../app/decode/numeralSystems'
import { CursorTypes } from '../../app/results'
import { cartesian, variantPermutations } from '../../app/decode/common'
import {
  decode as commonDecode,
  rearrange as commonRearrange,
} from '../../app/decode/numeralSystems'

export const getNumberButtons = (
  chars,
  input,
  cursorIdx,
  cursorType,
  labels
) => {
  return chars.map((char) => {
    return {
      char: char,
      label: labels[charToValueIndex(char)],
      preselected: cursorType === CursorTypes.edit && input[cursorIdx] === char,
    }
  })
}

export const getAllResults = (
  alphabetVariants,
  chars,
  partLength,
  getLabel,
  input,
  variantId,
  labels
) => {
  const baseOrders = [...Array(partLength).keys()].map((item) => item + 1)
  const baseChars = chars.join('')
  const variantChars = variantPermutations(baseChars.split(''), false).map(
    (variantAsArray) => variantAsArray.join('')
  )
  const variantOrders = variantPermutations(baseOrders, false).map((order) => [
    order,
  ])
  const variantDefinitions = cartesian(
    variantChars,
    variantOrders,
    alphabetVariants
  ).slice(1)
  const decodedVariants = [
    {
      label: getLabel(labels, baseChars, baseOrders, alphabetVariants[0]),
      message: input,
      alphabet: alphabetVariants[0],
    },
  ]
    .concat(
      variantDefinitions.map((variantDefinition) => {
        const altChars = variantDefinition[0]
        const altOrder = variantDefinition[1]
        const alphabet = variantDefinition[2]
        const message = commonRearrange(
          input,
          altChars,
          altOrder,
          partLength,
          chars
        )
        return {
          label: getLabel(labels, altChars, altOrder, alphabet),
          message: message,
          alphabet: alphabet,
        }
      })
    )
    .map((variant) => {
      return {
        label: variant.label,
        input: variant.message,
        decoded: variant.message.length
          ? commonDecode(variant.message, variant.alphabet, partLength, chars)
          : [],
        selected: variantId && variant.label === variantId,
        alphabet: variant.alphabet,
      }
    })
  return decodedVariants
}
