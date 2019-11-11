import { ElementFinder, ProtractorBrowser } from 'protractor'

export class AnalyticsComponent {
  constructor(private browser: ProtractorBrowser, public root: ElementFinder) { }
}
