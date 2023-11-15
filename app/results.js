import Typography from '@mui/material/Typography'
import Placeholder from '../component/Placeholder'
import * as React from 'react'
import ResultBox from '../component/ResultBox'
import { PartTypes, scoreResult } from './decode/common'

export const OutputCharTypes = {
  known: 'known',
  unknown: 'unknown',
}
export const PartTypeToOutputCharType = {
  [PartTypes.char]: OutputCharTypes.known,
  [PartTypes.separator]: OutputCharTypes.known,
  [PartTypes.unknown]: OutputCharTypes.unknown,
  [PartTypes.undecodable]: OutputCharTypes.unknown,
}

export const getOutputChar = (msgPart) => {
  let result = null
  if (msgPart.type === PartTypes.char) {
    result = msgPart.char.toUpperCase()
  } else if (
    [PartTypes.unknown, PartTypes.undecodable].includes(msgPart.type)
  ) {
    result = '?'
  } else {
    result = '␣'.repeat(msgPart.input.length - 1)
  }
  return result
}

export function decodedToResultBox(decodedVariant, key) {
  let forReact = decodedVariant.decoded
    .map((part, partIdx) => {
      const outputCharType = PartTypeToOutputCharType[part.type]
      const string = getOutputChar(part)
      const color =
        outputCharType === OutputCharTypes.unknown ? 'warning.main' : ''
      return string ? (
        <Typography
          component={'span'}
          key={partIdx}
          sx={{ color }}
          display="inline"
        >
          {string}
        </Typography>
      ) : null
    })
    .filter((part) => !!part)
  forReact = forReact && forReact.length ? forReact : <Placeholder />
  const resultBox = (
    <ResultBox key={key} label={decodedVariant.label} message={forReact} />
  )
  return resultBox
}

export function getResultBoxes(variantArray) {
  return variantArray
    .slice(0, 1)
    .concat(
      variantArray
        .slice(1)
        .sort((a, b) => scoreResult(a.decoded) - scoreResult(b.decoded))
    )
    .map((variant, idx) => {
      return decodedToResultBox(variant, `Var${idx}`)
    })
}
