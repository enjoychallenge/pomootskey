import { test, expect } from '@playwright/test'

const title = 'PreProd Pomootskey'

;[
  { pageAlt: 'morse', buttons: ['●', '‒', '/'] },
  { pageAlt: 'braille', buttons: ['1'] },
  { pageAlt: 'semaphore', buttons: ['1', '2'] },
  { pageAlt: 'ternary', buttons: ['0', '0', '0'] },
  { pageAlt: 'binary', buttons: ['0', '0', '0', '0', '1'] },
].forEach(({ pageAlt, buttons }) => {
  test(`${pageAlt}, A, by buttons`, async ({ page }) => {
    await page.getByAltText(pageAlt).click()

    for (const buttonText of buttons) {
      await page.locator('button').filter({ hasText: buttonText }).click()
    }

    await expect(page.getByTestId('outputChar')).toHaveCount(1)
    await expect(page.getByTestId('outputChar').first()).toHaveText('A')
  })
})

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

test('has main page', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(title)
})
