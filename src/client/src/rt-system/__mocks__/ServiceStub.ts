import { ServiceStub } from '../ServiceStub'
import { Observable } from 'rxjs'

type CallBack = (r: string, p: any, resp: string) => Observable<any>

//remoteProcedure: string, payload: TPayload, responseTopic: string = ''
const MockServiceStub = jest.fn<ServiceStub>((c1?: CallBack, c2?: CallBack) => ({
  subscribeToTopic: (r: string, p: any, resp: string) => c1!(r, p, resp),
  requestResponse: (r: string, p: any, resp = '') => c2!(r, p, resp),
}))

export default MockServiceStub
