import * as slice from '../features/ternary/ternarySlice'
import * as selector from '../features/ternary/ternarySelector'
import NumberSystemPage from '../component/NumberSystemPage'

export default function TernaryPage() {
  return NumberSystemPage(slice, selector)
}
