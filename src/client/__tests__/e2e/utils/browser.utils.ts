import { ElementFinder, ExpectedConditions as EC, ProtractorBrowser } from 'protractor'

export const waitForElementToBePresent = createBrowserExpectationAwaiter(EC.presenceOf.name, finder =>
  EC.presenceOf(finder),
)
export const waitForElementToBeVisible = createBrowserExpectationAwaiter(EC.visibilityOf.name, finder =>
  EC.visibilityOf(finder),
)
export const waitForElementToBeInvisible = createBrowserExpectationAwaiter(EC.invisibilityOf.name, finder =>
  EC.invisibilityOf(finder),
)
export const waitForElementToBeClickable = createBrowserExpectationAwaiter(EC.elementToBeClickable.name, finder =>
  EC.elementToBeClickable(finder),
)

function createBrowserExpectationAwaiter(expectationName: string, expectedConditions: (finder: ElementFinder) => any) {
  return async (browser: ProtractorBrowser, finder: ElementFinder, timeout = 10000) => {
    try {
      await browser.wait(expectedConditions(finder), timeout)
    } catch (error) {
      throw augmentErrorWithFinderDetails(error, expectationName, finder)
    }
  }
}

function augmentErrorWithFinderDetails(error: Error, expectation: string, finder: ElementFinder): Error {
  const selector = finder.locator().toString()

  const newError = new Error(`${error.message} while expecting ${expectation} ${selector}`)
  newError.name = error.name
  newError.stack = error.stack

  return newError
}
