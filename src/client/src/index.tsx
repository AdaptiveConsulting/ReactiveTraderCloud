import 'ress'
import './ui/styles/css/index.css'

import { parse } from 'query-string'
import { run } from './notificationBootstrapper'

const parsed = parse(location.search)

if (parsed.notification) {
  run()
} else {
  import('./main').then(mod => mod.run())
}
