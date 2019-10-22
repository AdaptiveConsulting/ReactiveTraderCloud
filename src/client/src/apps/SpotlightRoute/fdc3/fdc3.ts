import { DetectIntentResponse } from 'dialogflow'

const getOpenfinFdc3 = () => import('./openfinFdc3')
const getBrowserFdc3 = () => import('./browserFdc3')

export interface SpotlightApplication {
  id: string
  name: string
}

export interface SpotlightFdc3 {
  getMatchingApps(response: DetectIntentResponse): Promise<SpotlightApplication[]>

  open(appId: string): Promise<void>
}

export const getFdc3 = async () => {
  if ((window as any).fin) {
    const { OpenfinFdc3 } = await getOpenfinFdc3()
    return new OpenfinFdc3()
  }
  const { BrowserFdc3 } = await getBrowserFdc3()
  return new BrowserFdc3()
}
