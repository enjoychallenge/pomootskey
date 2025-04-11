import { scoreResult } from './app/decode/common'

onmessage = function (e) {
  if (!e) return
  const { variants, firstItem, pageSize } = e.data
  const lastItem = firstItem + pageSize || variantArray.length - 1

  const results = variants
    .slice(0, 1)
    .concat(
      variants
        .slice(1)
        .sort((a, b) => scoreResult(b.decoded) - scoreResult(a.decoded))
    )
    .slice(firstItem, lastItem)

  postMessage(results)
}
