import * as slice from '../features/binary/binarySlice'
import * as selector from '../features/binary/binarySelector'
import NumeralSystemPage from '../component/NumeralSystemPage'

export default function BinaryPage() {
  return NumeralSystemPage(slice, selector)
}
