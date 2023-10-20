export const getVariants = (
  message,
  labelPrefix = '',
  removeBaseVariant = true
) => {
  const allShifts = [...Array(8).keys()]
  const shifts = removeBaseVariant ? allShifts.slice(1) : allShifts
  return shifts.map((shift) => {
    const altMessage = message.map((item) => {
      return new Set(
        Array.from(item).map((num) => {
          return ((num - 1 + shift) % 8) + 1
        })
      )
    })
    return {
      label: `Alternativní řešení,${labelPrefix} otočení o ${shift * 45}°`,
      message: altMessage,
    }
  })
}
