// we need to start the runtime and know the devtools port
import { test as setup } from '@playwright/test'
import { launch } from 'openfin-adapter'

const E2E_RTC_WEB_ROOT_URL = process.env.E2E_RTC_WEB_ROOT_URL ?? "http://localhost:1917"

setup('Launching application...', async () => {
  await launch({ manifestUrl: `${E2E_RTC_WEB_ROOT_URL}/config/rt-fx.json`})
  await launch({ manifestUrl: `${E2E_RTC_WEB_ROOT_URL}/config/rt-credit.json`})
  await launch({ manifestUrl: `${E2E_RTC_WEB_ROOT_URL}/config/limit-checker.json`})
})
