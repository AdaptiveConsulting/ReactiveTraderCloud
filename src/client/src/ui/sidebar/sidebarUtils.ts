import * as classnames from 'classnames'

export function getSidebarStyles(displayAnalytics: boolean) {
  const buttonStyles = classnames(
    'sidebar-region__element-button glyphicon glyphicon-stats',
    (displayAnalytics && 'sidebar-region__element--active') || 'sidebar-region__element--inactive'
  )
  const analyticsStyles = classnames(
    'sidebar-region__content',
    !displayAnalytics && 'sidebar-region__container--no-content'
  )
  return { analyticsStyles, buttonStyles }
}
