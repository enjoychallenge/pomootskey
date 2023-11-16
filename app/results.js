import Typography from '@mui/material/Typography'
import Placeholder from '../component/Placeholder'
import * as React from 'react'
import VariantOutputOnlyBox from '../component/VariantOutputOnlyBox'
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

export const getOutputChar = (decodedPart) => {
  let result = null
  if (decodedPart.type === PartTypes.char) {
    result = decodedPart.char.toUpperCase()
  } else if (
    [PartTypes.unknown, PartTypes.undecodable].includes(decodedPart.type)
  ) {
    result = '?'
  } else {
    result = '␣'.repeat(decodedPart.input.length - 1)
  }
  return result
}

function decodedToVariantOutputOnlyBox(
  decodedVariant,
  idx,
  onVariantClick = null
) {
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
  const variantBox = (
    <VariantOutputOnlyBox
      key={idx}
      label={decodedVariant.label}
      message={forReact}
      idx={idx}
      onVariantClick={onVariantClick}
      selected={decodedVariant.selected}
    />
  )
  return variantBox
}

export function getVariantOutputOnlyBoxes(variantArray, onVariantClick = null) {
  return variantArray
    .slice(0, 1)
    .concat(
      variantArray
        .slice(1)
        .sort((a, b) => scoreResult(a.decoded) - scoreResult(b.decoded))
    )
    .map((variant, idx) => {
      return decodedToVariantOutputOnlyBox(variant, idx, onVariantClick)
    })
}
