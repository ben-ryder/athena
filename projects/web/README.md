# athena-web

A React web application for Athena, built using [Vite](https://vitejs.dev/).

## Quick Start
1. Run `npm install`
2. Copy `.env.example` to `.env` and set up variables
3. Run `npm start` to start the dev server
4. Run `npm run build` and `npm run preview` to build and preview a production build

## Testing
Jest (with jsdom) is used for unit testing and Playwright is used for E2E browser testing.

### Setup
1. Run `npm run test:e2e:setup` to ensure Playwright is installed correctly.
   - If you're using Linux, you may also have to run `npx playwright install-deps`

### Usage
- `npm run test:unit` to run all unit tests
- `npm run test:e2e` to run headless E2E tests
- `npm run test:e2e:ui` to open E2E testing in the Playwright UI
- `npm run test:e2e:report` to open the latest Playwright report
