import morse_styles from '../../styles/morse.module.scss'

export const getJoinerClass = (showJoiner, isStartItem, isEndItem) => {
  if (!showJoiner) {
    return morse_styles.result_input_char_joiner_hidden
  }
  if (isStartItem && isEndItem) {
    return morse_styles.result_input_char_joiner
  } else if (isStartItem && !isEndItem) {
    return morse_styles.result_input_char_joiner_start
  } else if (!isStartItem && isEndItem) {
    return morse_styles.result_input_char_joiner_end
  } else {
    return morse_styles.result_input_char_joiner_middle
  }
}
