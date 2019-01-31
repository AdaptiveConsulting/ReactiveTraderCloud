import { ApplicationDependencies } from 'applicationServices'

const MockApplicationDependencies = jest.fn<ApplicationDependencies>(
  (loadBalancedServiceStub?, referenceDataService?, platform?, limitChecker?, serviceStatus$?, connection$?) => ({
    referenceDataService,
    platform,
    limitChecker,
    loadBalancedServiceStub,
    serviceStatus$,
    connection$,
  }),
)
export default MockApplicationDependencies
