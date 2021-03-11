import { emitTooLongMessage } from "@/utils/emitTooLong"
import { testScheduler } from "@/utils/testScheduler"

const TOO_LONG = { status: "too long" }

const TAKING_TOO_LONG = 2_000

const response = {
  response: "I am a response",
}

describe("utils/emitTooLong", () => {
  it("should emit normal response if response is faster than timer", () => {
    testScheduler().run(({ expectObservable, cold }) => {
      const input = cold("    1999ms (a|)", { a: response })
      const expectedOutput = "1999ms (b|)"
      const result = input.pipe(emitTooLongMessage(TAKING_TOO_LONG, TOO_LONG))
      expectObservable(result).toBe(expectedOutput, {
        b: response,
      })
    })
  })

  it("should emit too long message if response is slowlier than timer", () => {
    testScheduler().run(({ expectObservable, cold }) => {
      const input = cold("    2s -(a|)", { a: response })
      const expectedOutput = "2s b(c|)"
      const result = input.pipe(emitTooLongMessage(TAKING_TOO_LONG, TOO_LONG))
      expectObservable(result).toBe(expectedOutput, {
        b: TOO_LONG,
        c: response,
      })
    })
  })
})
