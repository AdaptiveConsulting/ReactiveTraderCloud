import { CreateRfqRequest, WorkflowService } from "@/generated/TradingGateway"

export const createCreditRfq = (request: CreateRfqRequest) => {
  return WorkflowService.createRfq(request)
}
