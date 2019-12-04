import { useContext } from 'react';
import { ServiceStubContext } from './context';

export function useServiceStub() {
  return useContext(ServiceStubContext)
}
