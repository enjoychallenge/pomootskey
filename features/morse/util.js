import { decode } from '../../app/decode/morse'
import { OutputCharTypes } from '../../component/MorseResultBox'
import { PartTypes } from '../../app/decode/common'

export function messageToInputItems(message) {
  const inputItems = []

  decode(message).forEach((msgPart) => {
    let outputChar = null
    let outputCharType = OutputCharTypes.unknown
    if (msgPart.char) {
      outputChar = msgPart.char.toUpperCase()
      outputCharType = OutputCharTypes.known
    } else if (msgPart.type === PartTypes.unknown) {
      outputChar = `?`
      outputCharType = OutputCharTypes.unknown
    } else if (
      msgPart.type === PartTypes.separator &&
      msgPart.string.length < 4
    ) {
      outputCharType = OutputCharTypes.known
    }
    inputItems.push({
      input: msgPart.string[0],
      output: {
        type: outputCharType,
        showJoiner: [PartTypes.char, PartTypes.unknown].includes(msgPart.type),
        char: outputChar,
      },
    })
    inputItems.push(
      ...msgPart.string
        .split('')
        .slice(1)
        .map((msgChar) => ({
          input: msgChar,
        }))
    )
  })

  return inputItems
}
