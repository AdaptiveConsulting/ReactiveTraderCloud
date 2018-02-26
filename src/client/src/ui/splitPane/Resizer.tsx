import * as React from 'react';
import * as classNames from 'classnames';

export type SplitDirection = 'vertical' | 'horizontal';

interface ResizerProps {
  className:string;
  onMouseDown: (event:React.MouseEvent<HTMLDivElement>) => void;
  split: SplitDirection;
  style: any;
  resizerClassName: string;
}

export default class Resizer extends React.Component<ResizerProps, any> {

  render() {
    const { className, onMouseDown, split, style, resizerClassName } = this.props;
    const classes = classNames(className, split, resizerClassName);
    return <div className={classes}
                style={style}
                onMouseDown={onMouseDown}>
    </div>;
  }
}
