import { getJoinerClass } from './util'
import morse_styles from '../../styles/morse.module.scss'

describe('getJoinerClass', () => {
  test.each([
    {
      showJoiner: false,
      isStartItem: true,
      isEndItem: true,
      expResult: morse_styles.result_input_char_joiner_hidden,
    },
    {
      showJoiner: false,
      isStartItem: false,
      isEndItem: false,
      expResult: morse_styles.result_input_char_joiner_hidden,
    },
    {
      showJoiner: true,
      isStartItem: true,
      isEndItem: true,
      expResult: morse_styles.result_input_char_joiner,
    },
    {
      showJoiner: true,
      isStartItem: false,
      isEndItem: false,
      expResult: morse_styles.result_input_char_joiner_middle,
    },
    {
      showJoiner: true,
      isStartItem: true,
      isEndItem: false,
      expResult: morse_styles.result_input_char_joiner_start,
    },
    {
      showJoiner: true,
      isStartItem: false,
      isEndItem: true,
      expResult: morse_styles.result_input_char_joiner_end,
    },
  ])(
    'should return correct CSS class name for showJoiner=$showJoiner isStartItem=$isStartItem isEndItem=$isEndItem',
    ({ showJoiner, isStartItem, isEndItem, expResult }) => {
      const className = getJoinerClass(showJoiner, isStartItem, isEndItem)
      expect(className).toEqual(expResult)
    }
  )
})
