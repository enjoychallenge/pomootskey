import { useState } from 'react'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  decrement,
  increment,
  increment_by_amount,
  increment_async,
  increment_if_odd,
  select_count,
} from './counterSlice'
import styles from './Counter.module.css'

function Counter() {
  const dispatch = useAppDispatch()
  const count = useAppSelector(select_count)
  const [increment_amount, set_increment_amount] = useState('2')

  const increment_value = Number(increment_amount) || 0

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={increment_amount}
          onChange={(e) => set_increment_amount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(increment_by_amount(increment_value))}
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(increment_async(increment_value))}
        >
          Add Async
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(increment_if_odd(increment_value))}
        >
          Add If Odd
        </button>
      </div>
    </div>
  )
}

export default Counter
