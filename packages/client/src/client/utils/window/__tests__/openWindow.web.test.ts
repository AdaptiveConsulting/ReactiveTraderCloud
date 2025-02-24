import { openWindow } from "../openWindow.web"

vi.spyOn(window, "open").mockImplementation((url, name, features) => {
  const eventListeners: Record<string, () => void> = {}
  return {
    addEventListener: (eventType: string, listener: () => void) => {
      eventListeners[eventType] = listener
    },
    dispatchEvent: (event: Event) => {
      eventListeners[event.type]()
    },
    focus: vitest.fn(),
    name,
    url,
    screenX: Number(features?.replace(/.*screenX=([^,]*)(,.*|$)/, "$1")),
    screenY: Number(features?.replace(/.*screenY=([^,]*)(,.*|$)/, "$1")),
  } as any as Window // fudge the type, we only need to play with a few win attribs
})

describe("openWindow (web)", () => {
  let winRef

  afterEach(() => {
    winRef!.closed = true
  })

  test("should honour explicit screen x/y positions", async () => {
    winRef = await openWindow({
      url: "/blah",
      name: "name1",
      x: 100,
      y: 100,
      width: 300,
      height: 300,
    })
    expect(winRef?.name).toEqual("name1")
    expect(winRef?.screenX).toEqual(100)
    expect(winRef?.screenY).toEqual(100)
  })

  test("should calculate window position based on requested size and win defaults (1200 x 800)", async () => {
    winRef = await openWindow({
      url: "/blah",
      name: "name2",
      width: 300,
      height: 300,
    })
    expect(winRef?.name).toEqual("name2")
    expect(winRef?.screenX).toEqual(450)
    expect(winRef?.screenY).toEqual(250)
  })

  test("should calculate window position based on previous popup", async () => {
    winRef = await openWindow({
      url: "/blah",
      name: "name3",
      x: 5,
      y: 5,
      width: 300,
      height: 300,
    })
    expect(winRef?.screenX).toEqual(5)
    expect(winRef?.screenY).toEqual(5)

    winRef = await openWindow({
      url: "/blah",
      name: "name3",
      width: 300,
      height: 300,
    })
    expect(winRef?.screenX).toEqual(55)
    expect(winRef?.screenY).toEqual(55)
  })

  test("should call onClose function on window unload, after small delay", async () => {
    // quite a bit of fakery going on here .. but test is here to keep us honest
    // and keep track of the somewhat fiddly onClose handling we need while unload
    // goes through its browser deprecation and we turn to pagehide or visibilitychange
    vi.useFakeTimers()
    const onCloseHanderMock = vitest.fn()
    winRef = await openWindow(
      {
        url: "/blah",
        name: "name1",
        width: 300,
        height: 300,
      },
      onCloseHanderMock,
    )

    winRef?.dispatchEvent(new Event("unload"))
    // no immediate onClose ..
    expect(onCloseHanderMock).not.toBeCalled()

    // after timeout we should get onClose
    // have to manually enforce fake win ref's closed state
    // eslint-disable-next-line
    // @ts-ignore
    winRef!.closed = true
    vi.advanceTimersByTime(100)
    expect(onCloseHanderMock).toBeCalled()
  })
})
