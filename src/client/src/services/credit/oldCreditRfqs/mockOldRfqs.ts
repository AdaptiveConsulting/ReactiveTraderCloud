import { from } from "rxjs"
import { type EndOfStateOfTheWorldRfqUpdate, type StartOfStateOfTheWorldRfqUpdate,type RfqBody,type QuoteBody, } from "@/generated/TradingGateway"
import{  type QuoteState} from "@/generated/NewTradingGateway"

const dealerIdLength = 10 
const AmountOfRFQs = 10
const mockRFQs:any = []



const constructOldMockCreditRFQS = () => {
        constructOldRFQS()
        constructOldQuotes()
        addStateOfTheWorld()
        return mockRFQs
}

const randomNumberGenerator = (min:number, max:number) =>{
    //min and max are inclusive
    return Math.floor(Math.random() * (max - min + 1) + min)
}
const randomStateGenerator = () =>{
    const stateNumber = randomNumberGenerator(1,4)
    switch (stateNumber) {
        case 1:
            return "Open"
        case 2:
            return "Expired"

        case 3:
            return "Cancelled"

        case 4:
            return "Closed"

        default:
            break;
    }
}

const constructOldRFQS = () =>{
    for(let i = 0; i < AmountOfRFQs; i++){
    mockRFQs.push({
        payload:{
            creationTimestamp:(Date.now().toString()),
            dealerIds:[10,0,1,2,3,4,5,6,7,8,9],
            direction:'Buy',
            expirySecs:120,
            id:i,
            instrumentId:i,
            quantity:randomNumberGenerator(1,10000),
            state:randomStateGenerator()
            },
            type:"rfqCreated"
        })
    }
}
const constructOldQuotes = () =>{
    for(let i = 0; i < AmountOfRFQs; i++){
        for(let j = 0; j <= dealerIdLength; j++)
        mockRFQs.push({ 
            payload:{
            dealerId:j,
            id:i + j,
            price:randomNumberGenerator(20,500),
            rfqId:i,
            },
            type:"quoteCreated"
            
        })
}
}
const addStateOfTheWorld = () =>{
    mockRFQs.unshift({ type: "startOfStateOfTheWorld" })
    mockRFQs.push({type:"endOfStateOfTheWorld"})
}

export const mockCreditRFQS = () => {
        return from (constructOldMockCreditRFQS())
}
export const Dealers = [
    {
        type:'added',
        payload:{
            id:0,
            name:'J.P. Morgan'
        }
    },
    {
        type:'added',
        payload:{
            id:1,
            name:'Wells Fargo'
        }
    },
    {
        type:'added',
        payload:{
            id:2,
            name:'J.P. Morgan'
        }
    },
    {
        type:'added',
        payload:{
            id:3,
            name:'Bank of America'
        }
    },
    {
        type:'added',
        payload:{
            id:4,
            name:'Morgan Stanley'
        }
    },
    {
        type:'added',
        payload:{
            id:5,
            name:'Goldman Sachs'
        }
    },
    {
        type:'added',
        payload:{
            id:6,
            name:'Citigroup'
        }
    },
    {
        type:'added',
        payload:{
            id:7,
            name:'TD Bank'
        }
    },
    {
        type:'added',
        payload:{
            id:8,
            name:'Bank of New York Mellon'
        }
    },
    {
        type:'added',
        payload:{
            id:9,
            name:'UBS'
        }
    },
    {
        type:'added',
        payload:{
            id:10,
            name:'Capital One'
        }
    },
]

export const mockCreditDealers$ = () => {
    return from (Dealers)
}
