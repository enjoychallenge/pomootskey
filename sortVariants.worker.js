import { scoreResult, addToOrderedArray } from './app/decode/common'

onmessage = function (e) {
  if (!e) return
  const { variants } = e.data

  const baseVariant = variants.slice(0, 1)
  const variantsToSort = variants.slice(1)
  const sizes = [500, 10000, variantsToSort.length].filter(
    (size) => size <= variantsToSort.length
  )
  const scoredVariants = variantsToSort.map((variant) => {
    return {
      ...variant,
      score: -scoreResult(variant.decoded),
    }
  })

  const orderedVariants = []
  scoredVariants.forEach((variant, index) => {
    addToOrderedArray(orderedVariants, variant)
    if (sizes.includes(index + 1)) {
      postMessage({
        sorted: baseVariant.concat(orderedVariants),
        last: index + 1 === variantsToSort.length,
      })
    }
  })
}
