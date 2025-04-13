import { scoreResult, quickSortByScore } from './app/decode/common'

onmessage = function (e) {
  if (!e) return
  const { variants } = e.data

  const baseVariant = variants.slice(0, 1)
  const variantsToSort = variants.slice(1)
  const sizes = [500, 10000, variantsToSort.length].filter(
    (size) => size <= variantsToSort.length
  )
  sizes.forEach((size) => {
    const scoredVariants = variantsToSort.slice(0, size).map((variant) => {
      return {
        ...variant,
        score: -scoreResult(variant.decoded),
      }
    })

    quickSortByScore(
      scoredVariants,
      0,
      scoredVariants.length - 1,
      scoredVariants.length
    )

    postMessage({
      sorted: baseVariant.concat(scoredVariants),
      last: size === variantsToSort.length ? true : false,
    })
  })
}
