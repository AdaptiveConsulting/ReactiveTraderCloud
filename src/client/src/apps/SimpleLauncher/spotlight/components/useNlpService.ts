import { useCallback, useState } from 'react'
import { DetectIntentResponse } from 'dialogflow';
import { take, timeout } from 'rxjs/operators';
import { useServiceStub } from '../useServiceStab';

// hook to send request to nlp service
export const useNlpService = (): [boolean, DetectIntentResponse | undefined, (requestString: string) => void] => {
  const [response, setResponse] = useState<DetectIntentResponse>()
  const [contacting, setContacting] = useState(false)
  const serviceStub = useServiceStub()

  const sendRequest = useCallback((requestString: string) => {
    if (!requestString) {
      console.warn(`Skipping sending the request - request string is empty`)
      return
    }
    if (!serviceStub) {
      console.error(`Error creating subscription - serviceStub was not defined`)
      return
    }
    console.info('Sending NLP request:', requestString)

    setContacting(true)

    const subscription = serviceStub
      .createRequestResponseOperation<DetectIntentResponse[], string>(
        'nlp', // TODO: change to generic service before merging
        'getNlpIntent',
        requestString,
      )
      .pipe(
        timeout(10000),
        take(1),
      )
      .subscribe(
        result => {
          setContacting(false)
          setResponse(result[0])
        },
        (err: any) => {
          console.error(`Error in NLP request: ${err}`)
          setContacting(false)
        },
      )

    return () => subscription && subscription.unsubscribe()
  }, [serviceStub])

  return [contacting, response, sendRequest]
}
