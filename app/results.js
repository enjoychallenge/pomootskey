import Typography from '@mui/material/Typography'
import Placeholder from '../component/Placeholder'
import * as React from 'react'
import VariantOutputOnlyBox from '../component/VariantOutputOnlyBox'
import { PartTypes } from './decode/common'

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

export const JoinerTypes = {
  hidden: 'hidden',
  start: 'start',
  end: 'end',
  middle: 'middle',
  single: 'single',
}

export const CursorTypes = {
  insert: 'insert',
  edit: 'edit',
}

export const ArrowTypes = {
  left: 'left',
  right: 'right',
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

export function decodedToVariantOutputOnlyBox(
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
