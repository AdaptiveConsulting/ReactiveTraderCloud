import { Observable } from 'rxjs'
import { ServiceStubWithLoadBalancer } from 'rt-system'

const MockServiceStubWithLoadBalancer = jest.fn<ServiceStubWithLoadBalancer>(
  (getResponses: (service: string, operationName: string, request: any) => Observable<any>) => ({
    createStreamOperation: jest
      .fn((s: string, o: string, r: any) => getResponses(s, o, r))
      .mockName('createStreamOperation'),
  }),
)
export default MockServiceStubWithLoadBalancer
