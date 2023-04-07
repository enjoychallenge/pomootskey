import Typography from '@mui/material/Typography'
import Placeholder from '../component/Placeholder'
import * as React from 'react'
import ResultBox from '../component/ResultBox'
import { PartTypes } from './decode/common'

export function decodedToResultBox(decodedVariant, key) {
  let forReact = decodedVariant.decoded
    .map((part, partIdx) => {
      let string = ''
      let color = ''
      if (part.type === PartTypes.separator) {
        if (part.string.length === 2) {
          string = ' '
        } else if (part.string.length > 2) {
          string = '. ' + '␣'.repeat(part.string.length - 3)
        }
      } else if (part.type === PartTypes.char) {
        string = part.char
      } else {
        string = part.string || part.char
        color = 'warning.main'
      }
      return string ? (
        <Typography key={partIdx} sx={{ color }} display="inline">
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
  return variantArray.map((variant, idx) => {
    return decodedToResultBox(variant, `Var${idx}`)
  })
}
