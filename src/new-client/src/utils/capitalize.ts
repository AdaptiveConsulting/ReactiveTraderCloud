export const capitalize = (str: string | unknown) =>
  typeof str === "string"
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : str instanceof Object
    ? str.toString()
    : String(str)
