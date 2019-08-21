import { Standalone, Symphony } from 'rt-application'
import IApplication from './rt-application/IApplication'

const urlParams = new URLSearchParams(window.location.search)

let app: IApplication
if (urlParams.has('startAsSymphonyController')) app = new Symphony(urlParams, 'env')
else app = new Standalone(urlParams, 'waitFor')

app.run()
