# Development

## Install
```shell
yarn install
```

## Develop
```shell
yarn run dev
```

## Generate updated n-grams score
```shell
yarn run generate_ngrams_score
```

## Test
### Unit tests
Unit tests use [jest](https://jestjs.io/).
```shell
yarn run test
```

### Integration tests
Integration tests [playwright](https://playwright.dev/).
```shell
yarn playwright test
```

For local installation of playwright dependencies, you can run
```shell
yarn playwright install --with-deps
```

## Lint
```shell
yarn run lint
```

## Format
```shell
yarn run format
yarn run format-fix
```

## Deploy to pomootskey.enjoychallenge.tech
```shell
yarn run deploy-do-production
```
