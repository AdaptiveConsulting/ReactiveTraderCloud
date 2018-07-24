import classnames from 'classnames'
import React from 'react'
import { ApplicationStatusConst } from './applicationStatusConst'

interface StatusIndicatorProps {
  status: string
}

export const StatusIndicator: React.SFC<StatusIndicatorProps> = (props: StatusIndicatorProps) => {
  const wrapperStatusCssLookup = {
    [ApplicationStatusConst.Healthy]: 'status-indicator--healthy',
    [ApplicationStatusConst.Warning]: 'status-indicator--warning',
    [ApplicationStatusConst.Down]: 'status-indicator--down',
    [ApplicationStatusConst.Unknown]: ''
  }

  const iconStatusCssLookup = {
    [ApplicationStatusConst.Healthy]: 'fa fa-check',
    [ApplicationStatusConst.Warning]: '',
    [ApplicationStatusConst.Down]: 'fa fa-times',
    [ApplicationStatusConst.Unknown]: ''
  }

  const wrapperClasses = classnames('status-indicator footer__status-indicator', wrapperStatusCssLookup[props.status])
  const iconClasses = classnames('status-indicator__icon', iconStatusCssLookup[props.status])

  return (
    <div className={wrapperClasses}>
      <i className={iconClasses} />
    </div>
  )
}
