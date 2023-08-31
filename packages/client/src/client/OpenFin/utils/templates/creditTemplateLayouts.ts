import { ROUTES_CONFIG } from "@/client/constants"
import { constructUrl } from "@/client/utils/url"

import {
  createLayoutContent,
  createStack,
  createViewContent,
  settings,
} from "./shared"

export enum CreditView {
  RFQS = "RFQs",
  CreditBlotter = "Credit-Blotter",
  NewRFQ = "New-RFQ",
}

const viewContent = {
  rfqs: createViewContent("Credit RFQs", {
    url: constructUrl(ROUTES_CONFIG.creditRfqs),
    name: CreditView.RFQS,
  }),
  creditBlotter: createViewContent("Credit Blotter", {
    url: constructUrl(ROUTES_CONFIG.creditBlotter),
    name: CreditView.CreditBlotter,
  }),
  newRfq: createViewContent("Credit New RFQ", {
    url: constructUrl(ROUTES_CONFIG.newRfq),
    name: CreditView.NewRFQ,
  }),
}

const main = {
  settings,
  content: createLayoutContent([
    {
      type: "column",
      isClosable: true,
      title: "",
      width: 80,
      content: [
        createStack({ height: 50, content: viewContent.rfqs }),
        createStack({ content: viewContent.creditBlotter }),
      ],
    },
    createStack({ width: 30, content: viewContent.newRfq }),
  ]),
}

const blotterNewRfq = {
  settings,
  content: createLayoutContent([
    {
      type: "column",
      isClosable: true,
      title: "",
      width: 80,
      content: [
        createStack({ height: 50, content: viewContent.creditBlotter }),
      ],
    },
    createStack({ width: 30, content: viewContent.newRfq }),
  ]),
}

const rfqsNewRfq = {
  settings,
  content: createLayoutContent([
    {
      type: "column",
      isClosable: true,
      title: "",
      width: 80,
      content: [createStack({ height: 50, content: viewContent.rfqs })],
    },
    createStack({ width: 30, content: viewContent.newRfq }),
  ]),
}

const blotterRfqs = {
  settings,
  content: createLayoutContent([
    createStack({ height: 50, content: viewContent.rfqs }),
    createStack({ content: viewContent.creditBlotter }),
  ]),
}

export const creditTemplateLayouts = {
  main,
  blotterNewRfq,
  rfqsNewRfq,
  blotterRfqs,
}
