import { whenWatch, reset } from "@/utils/mockClient"
import { useStatus, status$ } from "./status"
import { renderHook, act } from "@testing-library/react-hooks"
import { BehaviorSubject } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import { RawServiceStatus, ServiceInstanceStatus } from "./types"
import { mapObject } from "@/utils"

const mockSource = {
  a: {
    Type: "nlp",
    Load: 1,
    TimeStamp: 0,
    Instance: "nlp.8895",
  } as RawServiceStatus,
  b: {
    Type: "priceHistory",
    Load: 1,
    TimeStamp: 0,
    Instance: "priceHistory.a917",
  } as RawServiceStatus,
}

const mockResult = {
  a: {
    nlp: {
      serviceId: "nlp.8895",
      serviceLoad: 1,
      serviceType: "nlp",
      timestamp: 0,
    },
  } as Record<string, ServiceInstanceStatus>,
  b: {
    nlp: {
      serviceId: "nlp.8895",
      serviceLoad: 1,
      serviceType: "nlp",
      timestamp: 0,
    },
    priceHistory: {
      serviceId: "priceHistory.a917",
      serviceLoad: 1,
      serviceType: "priceHistory",
      timestamp: 0,
    },
  } as Record<string, ServiceInstanceStatus>,
  c: {
    nlp: {
      serviceId: "nlp.8895",
      serviceLoad: 0,
      serviceType: "nlp",
      timestamp: 0,
    },
    priceHistory: {
      serviceId: "priceHistory.a917",
      serviceLoad: 1,
      serviceType: "priceHistory",
      timestamp: 2001,
    },
  } as Record<string, ServiceInstanceStatus>,
  d: {
    nlp: {
      serviceId: "nlp.8895",
      serviceLoad: 1,
      serviceType: "nlp",
      timestamp: 3001,
    },
    priceHistory: {
      serviceId: "priceHistory.a917",
      serviceLoad: 1,
      serviceType: "priceHistory",
      timestamp: 2001,
    },
  } as Record<string, ServiceInstanceStatus>,
}

const renderUseStatus = () => {
  return renderHook(() => useStatus(), {
    wrapper: ({ children }) => (
      <Subscribe source$={status$}>{children}</Subscribe>
    ),
  })
}

const trimTimestamps = (input: Record<string, { timestamp: number }>) =>
  mapObject(input, ({ timestamp, ...rest }) => rest)

describe("service/status", () => {
  describe("useStatus", () => {
    beforeEach(() => {
      jest.useFakeTimers("modern")
      reset()
    })

    it("should indicate all the service health when services are connected at beginning", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenWatch("status", mockStream)
      const { result } = renderUseStatus()
      expect(trimTimestamps(result.current)).toEqual(
        trimTimestamps(mockResult.a),
      )

      act(() => {
        mockStream.next(mockSource.b)
        jest.advanceTimersByTime(1999)
      })

      expect(trimTimestamps(result.current)).toEqual(
        trimTimestamps(mockResult.b),
      )
    })

    it("should show the unhealthy service when one of them are disconnected", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenWatch("status", mockStream)
      const { result } = renderUseStatus()
      expect(trimTimestamps(result.current)).toEqual(
        trimTimestamps(mockResult.a),
      )

      act(() => {
        jest.advanceTimersByTime(2001)
        mockStream.next(mockSource.b)
      })
      expect(trimTimestamps(result.current)).toEqual(
        trimTimestamps(mockResult.c),
      )
    })

    it("should show the service health again once the service is reconnected", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenWatch("status", mockStream)
      const { result } = renderUseStatus()
      expect(trimTimestamps(result.current)).toEqual(
        trimTimestamps(mockResult.a),
      )

      act(() => {
        jest.advanceTimersByTime(2001)
        mockStream.next(mockSource.b)
      })
      expect(trimTimestamps(result.current)).toEqual(
        trimTimestamps(mockResult.c),
      )

      act(() => {
        jest.advanceTimersByTime(1000)
        mockStream.next(mockSource.a)
      })
      expect(trimTimestamps(result.current)).toEqual(
        trimTimestamps(mockResult.d),
      )
    })
  })
})
