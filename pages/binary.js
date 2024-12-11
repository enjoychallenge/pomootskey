import * as slice from '../features/binary/binarySlice'
import * as selector from '../features/binary/binarySelector'
import NumberSystemPage from '../component/NumberSystemPage'

export default function BinaryPage() {
  return NumberSystemPage(slice, selector)
}
