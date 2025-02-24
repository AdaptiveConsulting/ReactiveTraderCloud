import { styleSheetSerializer } from "jest-styled-components/serializer"

window.gtag = Function.prototype
expect.addSnapshotSerializer(styleSheetSerializer)

globalThis.innerWidth = 1200
globalThis.innerHeight = 800
globalThis.outerWidth = 1200
globalThis.outerHeight = 800
