import { styleSheetSerializer } from "jest-styled-components/serializer"
window.ga = Function.prototype
expect.addSnapshotSerializer(styleSheetSerializer)
