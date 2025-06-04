import { expect, test } from '@playwright/test'
import { searchTypeEnum } from '../app/decode/words'

const expFirst = 'rybník'

;[
  { searchType: searchTypeEnum.Subtring, input: 'ybnik' },
  {
    searchType: searchTypeEnum.Regex,
    input: '^[mrs][áyeot][kšzbo][onrjk][ripea][onrjk]',
  },
  { searchType: searchTypeEnum.Anagram, input: 'kinbýr' },
].forEach(({ searchType, input }) => {
  test(`Smoke test words, ${searchType}`, async ({ page }) => {
    await page.getByTestId('searchTypeSelect').click()
    await page.getByTestId(searchType).click()

    await page.locator('input[type="text"]').fill(input)

    await expect(page.getByTestId('results').locator('p').first()).toHaveText(
      expFirst
    )
  })
})

test(`Invalid regex`, async ({ page }) => {
  await page.getByTestId('searchTypeSelect').click()
  await page.getByTestId(searchTypeEnum.Regex).click()

  await page.locator('input[type="text"]').fill('[agsdfg#$%^#')
  await expect(page.getByTestId('results')).toBeEmpty()
})

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.getByAltText('words').click()
})
