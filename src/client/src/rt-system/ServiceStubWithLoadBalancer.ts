import { share} from 'rxjs/operators'
import { ServiceStub } from './ServiceStub'


const LOG_NAME = 'ServiceClient: Initiated'

export default class ServiceStubWithLoadBalancer {
  constructor(
    private connection: ServiceStub,
  ) {}

  createRequestResponseOperation<TResponse, TRequest>(service: string, operationName: string, request: TRequest) {
    console.info(LOG_NAME, `Creating request response operation for [${operationName}]`)
    
    const remoteProcedure = service + '.' + operationName
    return this.connection.requestResponse<TResponse, TRequest>(remoteProcedure, request).pipe(share());

  }

  createStreamOperation<TResponse, TRequest = {}>(
    service: string,
    operationName: string,
    request: TRequest
  ) {
    const remoteProcedure = `${service}.${operationName}`
    console.log(`subscriping to RPC stream ${remoteProcedure}`)
    return this.connection.requestStream<TResponse, TRequest>(remoteProcedure, request).pipe(share());
  } 
}
