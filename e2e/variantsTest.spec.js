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
        '●',
        '/',
        '‒',
        '●',
        '●',
        '●',
        '/',
        '‒',
        '‒',
        '‒',
        '●',
      ],
    ],
    variantKey: 'Alternativní řešení ‒●/  ⇒  ●‒/',
  },
  {
    pageAlt: 'braille',
    buttons: [
      ['2', '4', '5', '6'],
      ['4', '6'],
      ['1', '3', '5', '6'],
      ['2', '4'],
      ['4', '5'],
      ['1', '3', '6'],
      ['4', '5'],
    ],
    variantKey: '123456-true',
  },
  {
    pageAlt: 'semaphore',
    buttons: [
      ['1', '4'],
      ['2', '6'],
      ['1', '3'],
      ['6', '7'],
      ['4', '7'],
      ['4', '6'],
      ['4', '7'],
    ],
    variantKey: '23456781',
  },
  {
    pageAlt: 'ternary',
    buttons: [
      [
        '0',
        '2',
        '1',
        '1',
        '2',
        '2',
        '0',
        '2',
        '2',
        '1',
        '1',
        '1',
        '1',
        '0',
        '0',
        '0',
        '2',
        '0',
        '1',
        '0',
        '0',
      ],
    ],
    variantKey:
      'Trojkovka (hodnoty 0=1, 1=2, 2=0; pořadí 1.=>1., 2.=>2., 3.=>3.; A=0, s Ch)',
  },
  {
    pageAlt: 'binary',
    buttons: [
      '1',
      '0',
      '1',
      '0',
      '0',
      '0',
      '1',
      '1',
      '0',
      '1',
      '1',
      '0',
      '1',
      '1',
      '0',
      '0',
      '0',
      '1',
      '0',
      '1',
      '0',
      '1',
      '0',
      '0',
      '1',
      '1',
      '0',
      '1',
      '0',
      '1',
      '0',
      '1',
      '0',
      '0',
      '1',
    ],
    variantKey: 'Binár (hodnoty 0=1, 1=0; pořadí =>12345; A=1)',
  },
].forEach(({ pageAlt, buttons, variantKey }) => {
  test(`${pageAlt}, KRIZVJV, as variant by buttons`, async ({ page }) => {
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
    await page.getByTestId(variantKey).click()
    const variantOutput = await page.getByTestId('variantOutputChar')

    let expectedVariantOutput = 'KRIZVJV'
    await expect(variantOutput).toHaveCount(expectedVariantOutput.length)
    for (let i = 0; i < expectedVariantOutput.length; i++) {
      await expect(variantOutput.nth(i)).toHaveText(expectedVariantOutput[i])
    }
  })
})

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})
