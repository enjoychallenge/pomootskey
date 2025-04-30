import { expect, test } from '@playwright/test'
;[
  {
    pageAlt: 'morse',
    buttons: [
      [
        '●',
        '‒',
        '●',
        '/',
        '‒',
        '●',
        '‒',
        '/',
        '‒',
        '‒',
        '/',
        '●',
        '●',
        '‒',
        '‒',
        '/',
        '‒',
        '‒',
        '‒',
      ],
    ],
    variantId: 'Alternativní řešení ‒●/  ⇒  ●‒/',
  },
  {
    pageAlt: 'braille',
    buttons: [
      ['2', '4', '5', '6'],
      ['4', '6'],
      ['1', '3', '5', '6'],
      ['2', '4'],
      ['1', '5', '6'],
    ],
    variantId: '123456-true',
  },
].forEach(({ pageAlt, buttons, variantId }) => {
  test(`${pageAlt}, KRIZS, as variant by buttons`, async ({ page }) => {
    await page.getByAltText(pageAlt).click()

    for (const charButtonText of buttons) {
      for (const buttonText of charButtonText) {
        await page.locator('button').filter({ hasText: buttonText }).click()
      }
      const forwardButton = page.getByAltText('forwardButton')
      if (await forwardButton.isEnabled()) {
        await forwardButton.click()
      }
    }

    await page.getByAltText('VariantsButton').click()

    await page.waitForTimeout(100)
    await page.getByTestId(variantId).click()
    const variantOutput = await page.getByTestId('variantOutputChar')

    let expectedVariantOutput = 'KRIZS'
    await expect(variantOutput).toHaveCount(expectedVariantOutput.length)
    for (let i = 0; i < expectedVariantOutput.length; i++) {
      await expect(variantOutput.nth(i)).toHaveText(expectedVariantOutput[i])
    }
  })
})

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})
