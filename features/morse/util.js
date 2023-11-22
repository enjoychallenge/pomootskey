import { decode } from '../../app/decode/morse'
import { getOutputChar, JoinerTypes, PartTypeToOutputCharType } from '../../app/results'
import { PartTypes } from '../../app/decode/common'

export const getInputItems = (input) => {
  const inputItems = []

  decode(input).forEach((msgPart) => {
    const outputChar = getOutputChar(msgPart)
    const outputCharType = PartTypeToOutputCharType[msgPart.type]
    let firstJoiner =
      msgPart.input.length === 1 ? JoinerTypes.single : JoinerTypes.start
    if ([PartTypes.undecodable, PartTypes.separator].includes(msgPart.type)) {
      firstJoiner = JoinerTypes.hidden
    }
    inputItems.push({
      input: msgPart.input[0],
      output: {
        type: outputCharType,
        char: outputChar,
      },
      joiner: firstJoiner,
    })
    inputItems.push(
      ...msgPart.input
        .split('')
        .slice(1)
        .map((msgChar, charIdx) => {
          let joiner = firstJoiner
          if (joiner !== JoinerTypes.hidden) {
            joiner =
              charIdx < msgPart.input.length - 2
                ? JoinerTypes.middle
                : JoinerTypes.end
          }
          return {
            input: msgChar,
            joiner,
          }
        })
    )
  })

  return inputItems
}
