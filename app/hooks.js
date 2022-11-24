import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const useForm = (default_values) => (handler) => async (event) => {
  event.preventDefault()
  event.persist()

  const form = event.target
  const elements = Array.from(form.elements)
  const data = elements
    .filter((element) => element.hasAttribute('name'))
    .reduce(
      (object, element) => ({
        ...object,
        [`${element.getAttribute('name')}`]: element.value,
      }),
      default_values
    )
  await handler(data)
  form.reset()
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
  const saved_callback = useRef()
  useEffect(() => {
    saved_callback.current = callback
  }, [callback])
  useEffect(() => {
    const handler = (...args) => saved_callback.current?.(...args)

    if (delay !== null) {
      const id = setInterval(handler, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch()

export const useAppSelector = useSelector
