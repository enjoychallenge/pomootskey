import * as slice from '../features/ternary/ternarySlice'
import * as selector from '../features/ternary/ternarySelector'
import NumeralSystemPage from '../component/NumeralSystemPage'

export default function TernaryPage() {
  return NumeralSystemPage(slice, selector)
}
