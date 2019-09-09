import { SymphonyClient } from 'symphony';
import { NLPServices } from '../nlp-services';
import { RTServices } from '../rt-services';

export type Handler = (symphony:SymphonyClient, nlpServices: NLPServices, services: RTServices)=>()=>void