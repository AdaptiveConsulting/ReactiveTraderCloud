import { equals } from "@/utils/equals"

test("it should return true when two inputs are the same value", () => {
  const object1 = "string1"
  const object2 = "string2"
  expect(equals(object1, object2)).toBe(false)

  const object3 = "string"
  const object4 = "string"
  expect(equals(object3, object4)).toBe(true)
})

test("it should return false when two object have different size", () => {
  const object1 = {
    a: "a",
    b: "b",
  }
  const object2 = {
    a: "a",
  }
  expect(equals(object1, object2)).toBe(false)
})

test("it should return true only when the two object have exactly the same attributes", () => {
  const object1 = {
    a: "a",
    b: "b",
  }
  const object2 = {
    a: "a",
    b: "c",
  }
  expect(equals(object1, object2)).toBe(false)
  const object3 = {
    a: "a",
    b: "b",
  }
  const object4 = {
    a: "a",
    b: "b",
  }
  expect(equals(object3, object4)).toBe(true)
})

test("Inherited properties should not be treated as equivalent", () => {
  const object1 = {
    a: 1,
    b: 2,
  }

  const object2 = Object.create(object1)

  expect(equals(object1, object2)).toBe(false)
})
