import { test } from '@playwright/test'
;[
  {
    pageAlt: 'braille',
    buttons: [
      ['2', '4', '5', '6'],
      ['4', '6'],
      ['1', '3', '5', '6'],
      ['2', '4'],
      ['1', '5', '6'],
    ],
  },
].forEach(({ pageAlt, buttons }) => {
  test(`${pageAlt}, KRIZS, as variant by buttons`, async ({ page }) => {
    await page.getByAltText(pageAlt).click()

    for (const charButtonText of buttons) {
      for (const buttonText of charButtonText) {
        await page.locator('button').filter({ hasText: buttonText }).click()
      }
      await page.getByAltText('forwardButton').click()
    }

    await page.getByAltText('VariantsButton').click()

    await page.waitForTimeout(100)
    await page.getByTestId('123456-true').click()
  })
})

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})
